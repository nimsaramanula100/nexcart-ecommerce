const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

dotenv.config();

const categories = [
  { name: "Women's Fashion", slug: 'womens-fashion', description: 'Trendy dresses, tops, skirts, and statement pieces for every occasion.', icon: 'shirt' },
  { name: "Men's Fashion", slug: 'mens-fashion', description: 'Sharp streetwear, premium tees, jackets, and modern essentials.', icon: 'user' },
  { name: 'Shoes & Sneakers', slug: 'shoes-sneakers', description: 'Stylish heels, chunky sneakers, elegant boots, and casual sandals.', icon: 'footprints' },
  { name: 'Bags & Accessories', slug: 'bags-accessories', description: 'Designer handbags, sleek wallets, trendy sunglasses, and belts.', icon: 'shopping-bag' },
  { name: 'Beauty & Skincare', slug: 'beauty-skincare', description: 'Luxurious makeup, serums, moisturizers, and signature fragrances.', icon: 'sparkles' },
  { name: 'Jewelry & Watches', slug: 'jewelry-watches', description: 'Elegant necklaces, rings, bracelets, and precision timepieces.', icon: 'watch' },
  { name: 'Electronics', slug: 'electronics', description: 'Premium headphones, speakers, tablets, and smart tech gadgets.', icon: 'laptop' },
  { name: 'Home & Living', slug: 'home-living', description: 'Cozy blankets, decorative pillows, scented candles, and organizers.', icon: 'home' },
];

const sampleProducts = [
  // WOMEN'S FASHION
  {
    name: 'Floral Wrap Midi Dress',
    description: 'Elegant floral wrap midi dress with a flattering V-neckline, ruffle trim, and adjustable waist tie. Made from lightweight chiffon fabric.',
    price: 34.99,
    originalPrice: 59.99,
    categoryName: "Women's Fashion",
    countInStock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 234,
    brand: 'ALoraLuxe',
    tags: ['dress', 'floral', 'summer', 'women'],
  },
  {
    name: 'Ribbed Knit Crop Top',
    description: 'Stretchy ribbed knit crop top with square neckline and short puff sleeves. Versatile staple.',
    price: 14.99,
    originalPrice: 24.99,
    categoryName: "Women's Fashion",
    countInStock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.5,
    numReviews: 189,
    brand: 'ALoraLuxe',
    tags: ['top', 'crop', 'women'],
  },
  {
    name: 'Satin Pleated Midi Skirt',
    description: 'Luxurious satin pleated midi skirt with an elastic high waistband. Beautiful sheen and drape.',
    price: 28.99,
    originalPrice: 45.99,
    categoryName: "Women's Fashion",
    countInStock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 156,
    brand: 'ALoraLuxe',
    tags: ['skirt', 'satin', 'women'],
  },

  // MEN'S FASHION
  {
    name: 'Premium Slim Fit Oxford Shirt',
    description: 'Classic Oxford button-down shirt in premium cotton with a tailored slim fit. Spread collar and single chest pocket.',
    price: 38.99,
    originalPrice: 54.99,
    categoryName: "Men's Fashion",
    countInStock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 203,
    brand: 'ALoraLuxe',
    tags: ['shirt', 'oxford', 'men'],
  },
  {
    name: 'Vintage Washed Denim Jacket',
    description: 'Retro-inspired denim jacket with a distressed vintage wash, chest pockets, and adjustable button cuffs.',
    price: 49.99,
    originalPrice: 69.99,
    categoryName: "Men's Fashion",
    countInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 176,
    brand: 'ALoraLuxe',
    tags: ['jacket', 'denim', 'men'],
  },
  {
    name: 'Tech Jogger Pants',
    description: 'Modern tech jogger pants with zippered pockets, tapered leg, and moisture-wicking fabric.',
    price: 32.99,
    originalPrice: 44.99,
    categoryName: "Men's Fashion",
    countInStock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.6,
    numReviews: 221,
    brand: 'ALoraLuxe',
    tags: ['joggers', 'pants', 'men'],
  },

  // SHOES & SNEAKERS
  {
    name: 'Chunky Platform Sneakers',
    description: 'Bold chunky platform sneakers with a 4cm sole lift, breathable mesh upper, and cushioned insole.',
    price: 44.99,
    originalPrice: 64.99,
    categoryName: 'Shoes & Sneakers',
    countInStock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 198,
    brand: 'ALoraLuxe',
    tags: ['sneakers', 'platform', 'shoes'],
  },
  {
    name: 'Pointed Toe Stiletto Heels',
    description: 'Sleek pointed-toe stiletto pumps with an 8cm heel, padded insole, and non-slip sole.',
    price: 39.99,
    originalPrice: 59.99,
    categoryName: 'Shoes & Sneakers',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.6,
    numReviews: 134,
    brand: 'ALoraLuxe',
    tags: ['heels', 'stiletto', 'shoes'],
  },

  // BAGS & ACCESSORIES
  {
    name: 'Quilted Chain Shoulder Bag',
    description: 'Elegant quilted shoulder bag with a gold chain strap, magnetic closure, and internal zip pocket.',
    price: 36.99,
    originalPrice: 54.99,
    categoryName: 'Bags & Accessories',
    countInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 167,
    brand: 'ALoraLuxe',
    tags: ['bag', 'shoulder', 'quilted'],
  },
  {
    name: 'Aviator Classic Sunglasses',
    description: 'Iconic aviator sunglasses with UV400 polarized lenses and lightweight metal frame.',
    price: 16.99,
    originalPrice: 29.99,
    categoryName: 'Bags & Accessories',
    countInStock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.5,
    numReviews: 456,
    brand: 'ALoraLuxe',
    tags: ['sunglasses', 'aviator'],
  },

  // BEAUTY & SKINCARE
  {
    name: 'Velvet Matte Lipstick Set',
    description: 'Luxurious set of 6 velvet matte lipsticks in curated shades from nude to bold red. Long-lasting formula.',
    price: 18.99,
    originalPrice: 34.99,
    categoryName: 'Beauty & Skincare',
    countInStock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 432,
    brand: 'ALoraLuxe',
    tags: ['lipstick', 'beauty', 'makeup'],
  },
  {
    name: 'Hyaluronic Acid Serum',
    description: 'Advanced hydrating serum with 2% hyaluronic acid, vitamin B5, and ceramides. Deeply moisturizes skin.',
    price: 22.99,
    originalPrice: 38.99,
    categoryName: 'Beauty & Skincare',
    countInStock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.9,
    numReviews: 567,
    brand: 'ALoraLuxe',
    tags: ['serum', 'skincare', 'beauty'],
  },

  // JEWELRY & WATCHES
  {
    name: 'Layered Gold Chain Necklace',
    description: 'Delicate triple-layered gold chain necklace with star pendant and moon charm. 18K gold-plated.',
    price: 14.99,
    originalPrice: 24.99,
    categoryName: 'Jewelry & Watches',
    countInStock: 110,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 389,
    brand: 'ALoraLuxe',
    tags: ['necklace', 'gold', 'jewelry'],
  },
  {
    name: 'Minimalist Analog Watch',
    description: 'Ultra-thin minimalist analog watch with genuine leather strap and Japanese quartz movement.',
    price: 59.99,
    originalPrice: 89.99,
    categoryName: 'Jewelry & Watches',
    countInStock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 156,
    brand: 'ALoraLuxe',
    tags: ['watch', 'minimalist', 'jewelry'],
  },

  // ELECTRONICS
  {
    name: 'AeroPulse Wireless ANC Headphones',
    description: 'Immersive spatial audio with hybrid active noise cancellation, custom 40mm titanium drivers, and 45-hour battery life.',
    price: 79.99,
    originalPrice: 129.99,
    categoryName: 'Electronics',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 542,
    brand: 'ALoraLuxe',
    tags: ['headphones', 'electronics', 'wireless'],
  },
  {
    name: 'Smart Fitness Tracker Watch',
    description: 'Advanced fitness tracker with AMOLED display, heart rate & SpO2 monitoring, and 7-day battery.',
    price: 49.99,
    originalPrice: 79.99,
    categoryName: 'Electronics',
    countInStock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 389,
    brand: 'ALoraLuxe',
    tags: ['smartwatch', 'fitness', 'electronics'],
  },

  // HOME & LIVING
  {
    name: 'Scented Soy Candle Collection',
    description: 'Set of 3 hand-poured soy wax candles in amber glass jars. 40-hour burn time each.',
    price: 24.99,
    originalPrice: 39.99,
    categoryName: 'Home & Living',
    countInStock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 178,
    brand: 'ALoraLuxe',
    tags: ['candle', 'scented', 'home'],
  },
  {
    name: 'Velvet Throw Pillow Covers (Set of 2)',
    description: 'Luxurious velvet pillow covers with hidden zipper closure. Set of 2 in complementary tones.',
    price: 16.99,
    originalPrice: 26.99,
    categoryName: 'Home & Living',
    countInStock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0c2989dae0c?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.5,
    numReviews: 234,
    brand: 'ALoraLuxe',
    tags: ['pillow', 'velvet', 'home'],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aloraluxe';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('[Seed] Database connection established via MongoDB.');
    } catch (err) {
      console.warn('[Seed] Local MongoDB not detected. Spinning up In-Memory MongoDB Server for seed execution...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('[Seed] Database connection established via In-Memory MongoDB Server.');
    }

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log('[Seed] Cleared old collections.');

    // Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`[Seed] Created ${createdCategories.length} categories.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Seed Users
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@nexcart.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      address: {
        street: '100 ALoraLuxe HQ Ave',
        city: 'Techopolis',
        state: 'CA',
        postalCode: '94016',
        country: 'United States',
      },
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'customer',
      phone: '+1 (555) 392-1049',
      address: {
        street: '452 Innovation Blvd',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
      },
    });

    console.log('[Seed] Created Admin & Customer accounts.');

    const productsWithRefs = sampleProducts.map((p) => ({
      ...p,
      category: categoryMap[p.categoryName] || null,
    }));

    const createdProducts = await Product.insertMany(productsWithRefs);
    console.log(`[Seed] Created ${createdProducts.length} sample products.`);

    console.log('\n=============================================');
    console.log(' ALORALUXE SEED SUCCESSFUL');
    console.log('=============================================');
    console.log(' Admin Account: admin@nexcart.com / admin123');
    console.log(' Customer Account: john@example.com / user123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDatabase();

