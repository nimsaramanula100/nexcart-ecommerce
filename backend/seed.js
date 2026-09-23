const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Next-gen gadgets, monitors, and modern productivity tech.',
    icon: 'laptop',
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smartwatches, fitness bands, and wearable intelligent accessories.',
    icon: 'watch',
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Studio-quality wireless headphones, earbuds, and hi-fi speakers.',
    icon: 'headphones',
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'High-performance mechanical keyboards, mice, and immersive gear.',
    icon: 'gamepad',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Minimalist streetwear, luxury watches, and modern essentials.',
    icon: 'shopping-bag',
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Ambient smart lights, IoT home automation, and smart displays.',
    icon: 'home',
  },
];

const sampleProducts = [
  {
    name: 'AeroPulse Wireless ANC Headphones',
    description: 'Immersive spatial audio with hybrid active noise cancellation, custom 40mm titanium drivers, and 45-hour battery life.',
    price: 199.99,
    originalPrice: 249.99,
    categoryName: 'Audio',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 42,
    brand: 'AeroTech',
    tags: ['wireless', 'noise-cancelling', 'audio'],
  },
  {
    name: 'Zenith OLED Smart Fitness Watch v2',
    description: 'Always-on AMOLED display with real-time heart rate monitoring, SPO2 tracking, GPS navigation, and 7-day battery life.',
    price: 149.99,
    originalPrice: 189.99,
    categoryName: 'Wearables',
    countInStock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.7,
    numReviews: 29,
    brand: 'Zenith',
    tags: ['smartwatch', 'fitness', 'health'],
  },
  {
    name: 'CyberBlade RGB Mechanical Keyboard',
    description: 'Hot-swappable linear mechanical switches, aircraft-grade aluminum top frame, per-key RGB lighting, and braided USB-C cable.',
    price: 119.99,
    originalPrice: 139.99,
    categoryName: 'Gaming',
    countInStock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.9,
    numReviews: 56,
    brand: 'CyberGear',
    tags: ['gaming', 'keyboard', 'rgb'],
  },
  {
    name: 'UltraView 34" Curved Gaming Monitor',
    description: '34-inch WQHD 165Hz Curved Gaming Monitor with 1ms response time, HDR400, and AMD FreeSync Premium support.',
    price: 479.99,
    originalPrice: 549.99,
    categoryName: 'Electronics',
    countInStock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.9,
    numReviews: 31,
    brand: 'UltraVision',
    tags: ['monitor', 'curved', '4k'],
  },
  {
    name: 'Luminary Minimalist Desk Lamp',
    description: 'Stepless dimming LED desk lamp with wireless charging pad base, touch controls, and color temperature adjustment.',
    price: 59.99,
    originalPrice: 79.99,
    categoryName: 'Smart Home',
    countInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.5,
    numReviews: 19,
    brand: 'Luminary',
    tags: ['home', 'lamp', 'wireless-charger'],
  },
  {
    name: 'Apex Pro Ergonomic Wireless Mouse',
    description: 'Precision 26K DPI optical sensor, ultra-lightweight 59g body, zero-latency 2.4GHz wireless connection, and PTFE feet.',
    price: 89.99,
    originalPrice: 109.99,
    categoryName: 'Gaming',
    countInStock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.6,
    numReviews: 24,
    brand: 'Apex',
    tags: ['mouse', 'wireless', 'gaming'],
  },
  {
    name: 'Velocity Urban Tech Waterproof Backpack',
    description: 'Ergonomic 25L modular backpack crafted from durable Cordura fabric with padded 16" laptop sleeve and anti-theft pocket.',
    price: 79.99,
    originalPrice: 99.99,
    categoryName: 'Fashion',
    countInStock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    rating: 4.8,
    numReviews: 38,
    brand: 'Velocity',
    tags: ['backpack', 'fashion', 'waterproof'],
  },
  {
    name: 'SonicSphere Portable Bluetooth Speaker',
    description: '360-degree immersive sound, deep bass radiators, IPX7 waterproof rating, and up to 20 hours of continuous wireless playback.',
    price: 69.99,
    originalPrice: 89.99,
    categoryName: 'Audio',
    countInStock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    rating: 4.7,
    numReviews: 15,
    brand: 'SonicSphere',
    tags: ['speaker', 'bluetooth', 'waterproof'],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexcart';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('[Seed] Database connection established via local MongoDB.');
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

    // Map category name to ObjectId
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
        street: '100 NexCart HQ Ave',
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

    // Prepare products with category refs
    const productsWithRefs = sampleProducts.map((p) => ({
      ...p,
      category: categoryMap[p.categoryName] || null,
    }));

    const createdProducts = await Product.insertMany(productsWithRefs);
    console.log(`[Seed] Created ${createdProducts.length} sample products.`);

    // Create initial sample order
    const sampleOrder = await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          quantity: 1,
          imageUrl: createdProducts[0].imageUrl,
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
        {
          name: createdProducts[1].name,
          quantity: 1,
          imageUrl: createdProducts[1].imageUrl,
          price: createdProducts[1].price,
          product: createdProducts[1]._id,
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        address: customerUser.address.street,
        city: customerUser.address.city,
        postalCode: customerUser.address.postalCode,
        country: customerUser.address.country,
        phone: customerUser.phone,
      },
      paymentMethod: 'Simulated Card Payment',
      itemsPrice: 349.98,
      taxPrice: 28.0,
      shippingPrice: 15.0,
      totalPrice: 392.98,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
      status: 'Processing',
    });

    console.log(`[Seed] Created sample order #${sampleOrder._id}`);

    console.log('\n=============================================');
    console.log(' NEXCART SEED SUCCESSFUL');
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
