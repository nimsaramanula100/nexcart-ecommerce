const imageFiles = import.meta.glob([
  '../../../img/*.{jpg,jpeg,png,webp}',
  '!../../../img/*%*',
], {
  eager: true,
  query: '?url',
  import: 'default',
});

const categoryRules = [
  { name: 'Shoes & Sneakers', pattern: /shoe|sneaker|trainer|boots|boot |footwear|vans|nike vomero/i, range: [8500, 32000] },
  { name: 'Beauty & Skincare', pattern: /beauty|skincare|serum|lipstick|lips|skin|glow|complexion|cosmetic|drugstore|anua|medicube/i, range: [2200, 18000] },
  { name: 'Jewelry & Watches', pattern: /jewel|jewellery|jewelry|necklace|bracelet|ring|earring|watch|diamond|moissanite/i, range: [1800, 38000] },
  { name: 'Electronics', pattern: /router|smartphone|phone|airpod|earbud|headphone|charger|power bank|portable charger|speaker|mouse|camera|osmo|galaxy|samsung|wi-fi|wifi|fan|laptop/i, range: [3500, 125000] },
  { name: 'Sports & Fitness', pattern: /gym|fitness|workout|sports|running|training/i, range: [3500, 95000] },
  { name: 'Home & Living', pattern: /home|cushion|lamp|chandelier|refrigerator|kitchen|vase|ceramic|decor|pillow|college|travel neck|sleep mask/i, range: [2500, 85000] },
  { name: 'Bags & Accessories', pattern: /bag|backpack|handbag|luggage|suitcase|glasses|eyewear|hat|cap|claw clip|hair accessory|travel laptop/i, range: [2500, 26000] },
  { name: "Men's Fashion", pattern: /\bmen(?:'s|s)?\b|gentleman|heren|tweedelige|streetwear|overshirt|woods|streets combo|the crossover/i, range: [5000, 26000] },
  { name: "Women's Fashion", pattern: /women|woman|girl|lady|outfit|dress|skirt|blouse|jeans|fashion|shirt|trouser|pants|jacket|coat|tee|top|hoodie|sweater|cardigan|clothing|wear/i, range: [4500, 24000] },
];

const categoryDetails = {
  "Women's Fashion": 'A versatile wardrobe piece selected for easy styling, comfortable everyday wear, and a polished finish. Check the product photos for its fit, color, and styling details.',
  "Men's Fashion": 'A modern everyday essential with an easy-to-style look and comfortable feel. Product photos show the design and styling; check the available options before ordering.',
  'Shoes & Sneakers': 'A versatile pair designed to bring comfort and everyday style together. Review the product photos for design details and choose your usual fit, noting any sizing guidance in the title.',
  'Bags & Accessories': 'A practical accessory with a clean, versatile design for daily use, commuting, or travel. Product photos show the finish, compartments, and styling details.',
  'Beauty & Skincare': 'A beauty essential for a simple daily routine. Review the packaging and product photos for the item details, and check the label for ingredients and usage guidance.',
  'Jewelry & Watches': 'A timeless accessory designed to add a considered finishing touch to everyday or occasion styling. Product photos show the design and finish.',
  Electronics: 'A useful tech essential for everyday convenience. Review the product photos and title for the visible design and included features before ordering.',
  'Sports & Fitness': 'A practical pick for active routines and home workouts. Check the product photos and title for the equipment design and intended use.',
  'Home & Living': 'A considered home essential that brings function and style to everyday spaces. Product photos show its design and finish.',
};

const categoryOverrides = {
  '101119954129769238.jpg': 'Bags & Accessories',
  '10836855347764467.jpg': 'Jewelry & Watches',
  '1104437508654011525.jpg': "Men's Fashion",
  '1196337402525526.jpg': 'Shoes & Sneakers',
  '122934264825149737.jpg': 'Jewelry & Watches',
  '1337074886926133.jpg': 'Jewelry & Watches',
  '137008013661211502.jpg': 'Beauty & Skincare',
  '13721973862309088.jpg': "Men's Fashion",
  '1407443631263027.jpg': "Women's Fashion",
  '140806235190584.jpg': 'Beauty & Skincare',
  '14496030045407245.jpg': 'Jewelry & Watches',
  '14918242512408976.jpg': 'Jewelry & Watches',
  '211174978209721.jpg': "Men's Fashion",
  '2603712275701131.jpg': 'Bags & Accessories',
  '281543715903128.jpg': 'Shoes & Sneakers',
  '319755642316663217.jpg': 'Shoes & Sneakers',
  '47358233577892518.jpg': "Women's Fashion",
  '582582901848302181.jpg': "Women's Fashion",
  '66146688275143963.jpg': "Men's Fashion",
  '68820700553441277.jpg': 'Shoes & Sneakers',
  '74027987621941193.jpg': 'Beauty & Skincare',
  'blue linen shirt with white pants.jpg': "Men's Fashion",
  'Woods & Streets Combo.jpg': "Men's Fashion",
};

const priceSteps = [0, 700, 1400, 2100, 2800, 3500, 4200];

const products = [
  ...Object.entries(imageFiles).map(([filePath, imageUrl], index) => {
    const fileName = filePath.split('/').pop().replace(/\.[^.]+$/, '');
    const normalizedName = fileName.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const categoryName = categoryOverrides[fileName]
      || categoryRules.find((category) => category.pattern.test(normalizedName))?.name
      || "Women's Fashion";
    const matchedCategory = categoryRules.find((category) => category.name === categoryName);
    const [minimumPrice, maximumPrice] = matchedCategory.range;
    const price = Math.round((minimumPrice + (index * 977) % (maximumPrice - minimumPrice) + priceSteps[index % priceSteps.length]) / 100) * 100;
    const slug = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
    const isApparel = categoryName === "Women's Fashion" || categoryName === "Men's Fashion";

    return {
      _id: `local-${slug || 'product'}-${index}`,
      name: normalizedName,
      description: categoryDetails[categoryName],
      price,
      originalPrice: Math.ceil(price * 1.2 / 100) * 100,
      categoryName,
      countInStock: 12 + (index * 7) % 38,
      imageUrl: imageUrl.replace(/%(?![0-9a-f]{2})/gi, '%25'),
      images: [imageUrl.replace(/%(?![0-9a-f]{2})/gi, '%25')],
      isFeatured: index % 4 === 0,
      isNewArrival: index % 3 === 0,
      isTrending: index % 5 === 0,
      rating: Number((4.2 + (index % 8) / 10).toFixed(1)),
      numReviews: 18 + (index * 13) % 280,
      soldCount: 45 + (index * 61) % 1800,
      brand: 'NexCart Select',
      colors: [],
      sizes: isApparel ? ['S', 'M', 'L', 'XL'] : [],
    };
  }),
  {
    _id: 'local-new-trip-suitcase',
    name: 'New Trip Hard-Shell Suitcase',
    description: categoryDetails['Bags & Accessories'],
    price: 22900,
    originalPrice: 27900,
    categoryName: 'Bags & Accessories',
    countInStock: 18,
    imageUrl: '/suitcase.jpg',
    images: ['/suitcase.jpg'],
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
    rating: 4.7,
    numReviews: 84,
    soldCount: 620,
    brand: 'NexCart Select',
    colors: [],
    sizes: [],
  },
].sort((left, right) => left.name.localeCompare(right.name));

export const categories = categoryRules
  .map(({ name }) => {
    const firstProduct = products.find((product) => product.categoryName === name);
    return firstProduct ? {
      _id: `local-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name,
      description: `Browse ${name.toLowerCase()} from our locally curated collection.`,
      imageUrl: firstProduct.imageUrl,
    } : null;
  })
  .filter(Boolean);

export const getProducts = ({ category, keyword, minPrice, maxPrice, sort } = {}) => {
  const normalizedKeyword = (keyword || '').trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !category || category.toLowerCase() === 'all' || product.categoryName === category;
    const matchesKeyword = !normalizedKeyword || `${product.name} ${product.categoryName}`.toLowerCase().includes(normalizedKeyword);
    const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);
    return matchesCategory && matchesKeyword && matchesMinPrice && matchesMaxPrice;
  });

  if (sort === 'price-asc') filteredProducts.sort((left, right) => left.price - right.price);
  else if (sort === 'price-desc') filteredProducts.sort((left, right) => right.price - left.price);
  else if (sort === 'rating') filteredProducts.sort((left, right) => right.rating - left.rating);
  else if (sort === 'newest') filteredProducts.sort((left, right) => Number(right.isNewArrival) - Number(left.isNewArrival));

  return filteredProducts;
};

export const getProductById = (id) => products.find((product) => product._id === id);

export const formatLkr = (amount) => `LKR ${Number(amount || 0).toLocaleString('en-LK')}`;