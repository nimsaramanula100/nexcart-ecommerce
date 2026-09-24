const Category = require('../models/Category');
const Product = require('../models/Product');
const store = require('../config/inMemoryStore');

const autoSeed = async () => {
  try {
    if (global.IS_IN_MEMORY_MODE) return;

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('[AutoSeed] Seeding initial categories into MongoDB...');
      await Category.insertMany(
        store.categories.map((c) => ({
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
          description: c.description || '',
          imageUrl: c.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        }))
      );
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[AutoSeed] Seeding initial products into MongoDB...');
      const createdCategories = await Category.find({});
      const categoryMap = {};
      createdCategories.forEach((cat) => {
        categoryMap[cat.name] = cat._id;
      });

      const productsToInsert = store.products.map((p) => {
        const { _id, ...rest } = p;
        return {
          ...rest,
          category: categoryMap[p.categoryName] || null,
        };
      });

      await Product.insertMany(productsToInsert);
      console.log(`[AutoSeed] Successfully seeded ${productsToInsert.length} products into MongoDB.`);
    }
  } catch (err) {
    console.error('[AutoSeed Error]:', err.message);
  }
};

module.exports = autoSeed;
