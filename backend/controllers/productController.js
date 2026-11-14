// EN: Serve catalogue search/filter/sort and admin product changes for productRoutes; MongoDB and fallback paths return matching data; SI: productRoutes සඳහා catalogue සෙවුම්/පෙරහන්/අනුපිළිවෙළ සහ admin වෙනස්කම් හසුරුවා data source දෙකෙන්ම සමාන ප්‍රතිඵල සපයයි.
const Product = require('../models/Product');
const store = require('../config/inMemoryStore');
const autoSeed = require('../utils/autoSeed');

// @desc    Fetch all products with search, filter, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  // EN: Apply query filters, sort results, and paginate them in either storage mode; SI: storage mode දෙකේදීම query පෙරහන් යොදා ප්‍රතිඵල අනුපිළිවෙළට සකසා පිටුගත කරයි.
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    if (!global.IS_IN_MEMORY_MODE) {
      await autoSeed();
    }

    if (global.IS_IN_MEMORY_MODE) {
      let filtered = [...store.products];

      if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            (p.description && p.description.toLowerCase().includes(kw)) ||
            (p.brand && p.brand.toLowerCase().includes(kw)) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(kw)) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(kw)))
        );
      }
      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.categoryName.toLowerCase() === category.toLowerCase());
      }
      if (minPrice) {
        filtered = filtered.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      }

      if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const totalProducts = filtered.length;
      const paginated = filtered.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

      return res.json({
        products: paginated,
        page: Number(page),
        pages: Math.ceil(totalProducts / Number(limit)) || 1,
        totalProducts,
      });
    }

    let query = {};
    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { brand: regex },
        { categoryName: regex },
        { tags: regex },
      ];
    }
    if (category && category !== 'All') query.categoryName = { $regex: new RegExp(`^${category}$`, 'i') };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'rating') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1));

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)) || 1,
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  // EN: Return a capped list of products marked as featured; SI: featured ලෙස සලකුණු කළ products සීමිත ලැයිස්තුවක් ලබා දෙයි.
  try {
    if (!global.IS_IN_MEMORY_MODE) {
      await autoSeed();
    }
    if (global.IS_IN_MEMORY_MODE) {
      const featured = store.products.filter((p) => p.isFeatured).slice(0, 8);
      return res.json(featured);
    }
    const featured = await Product.find({ isFeatured: true }).limit(8);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  // EN: Look up a single product by route ID and return 404 if absent; SI: route ID අනුව එක් product එකක් සොයා නොමැති විට 404 ලබා දෙයි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const product = store.products.find((p) => p._id === req.params.id);
      if (product) return res.json(product);
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Invalid product ID' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  // EN: Validate required product fields, apply defaults, and persist the new catalogue record; SI: අවශ්‍ය product fields තහවුරු කර defaults යොදා නව catalogue record එක සුරකියි.
  try {
    const { name, price, originalPrice, description, imageUrl, categoryName, countInStock, isFeatured, brand } = req.body;
    if (!name || price === undefined || !description || !imageUrl || !categoryName) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    if (global.IS_IN_MEMORY_MODE) {
      const newProd = {
        _id: `prod_${Date.now()}`,
        name,
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        description,
        imageUrl,
        categoryName,
        countInStock: Number(countInStock || 10),
        isFeatured: Boolean(isFeatured),
        brand: brand || 'ALoraLuxe',
        rating: 4.8,
        numReviews: 1,
        createdAt: new Date(),
      };
      store.products.unshift(newProd);
      return res.status(201).json(newProd);
    }

    const product = new Product({
      name, price, originalPrice: originalPrice || price, description, imageUrl, categoryName,
      countInStock: countInStock !== undefined ? countInStock : 10,
      isFeatured: Boolean(isFeatured), brand: brand || 'NexCart',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  // EN: Merge submitted fields into the matching product and save the updated record; SI: ඉදිරිපත් කළ fields ගැළපෙන product එකට එක්කර යාවත්කාලීන record එක සුරකියි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const index = store.products.findIndex((p) => p._id === req.params.id);
      if (index > -1) {
        store.products[index] = { ...store.products[index], ...req.body };
        return res.json(store.products[index]);
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  // EN: Remove the product identified by the route parameter; SI: route parameter එකෙන් හඳුනාගත් product එක ඉවත් කරයි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      store.products = store.products.filter((p) => p._id !== req.params.id);
      return res.json({ message: 'Product removed successfully' });
    }
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  // EN: Return products flagged as trending or with sales above the configured threshold; SI: trending ලෙස සලකුණු කළ හෝ නියමිත sales සීමාව ඉක්මවූ products ලබා දෙයි.
  try {
    if (!global.IS_IN_MEMORY_MODE) {
      await autoSeed();
    }
    if (global.IS_IN_MEMORY_MODE) {
      const trending = store.products.filter((p) => p.isTrending || p.soldCount > 200).slice(0, 10);
      return res.json(trending);
    }
    const trending = await Product.find({ $or: [{ isTrending: true }, { soldCount: { $gt: 200 } }] }).limit(10);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  // EN: Return a capped list marked as new arrivals; SI: new arrivals ලෙස සලකුණු කළ products සීමිත ලැයිස්තුවක් ලබා දෙයි.
  try {
    if (!global.IS_IN_MEMORY_MODE) {
      await autoSeed();
    }
    if (global.IS_IN_MEMORY_MODE) {
      const newArrivals = store.products.filter((p) => p.isNewArrival).slice(0, 10);
      return res.json(newArrivals);
    }
    const newArrivals = await Product.find({ isNewArrival: true }).limit(10);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
