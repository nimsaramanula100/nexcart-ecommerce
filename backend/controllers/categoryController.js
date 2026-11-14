// EN: Handle category listing and admin-managed category creation/deletion for categoryRoutes; SI: categoryRoutes සඳහා category ලැයිස්තුගත කිරීම හා admin මඟින් නිර්මාණය/මැකීම හසුරුවයි.
const Category = require('../models/Category');
const store = require('../config/inMemoryStore');
const autoSeed = require('../utils/autoSeed');

const getCategories = async (req, res) => {
  // EN: Seed MongoDB if needed, then return categories from MongoDB or the in-memory dataset; SI: අවශ්‍ය නම් MongoDB seed කර MongoDB හෝ memory dataset වෙතින් categories ලබා දෙයි.
  try {
    if (!global.IS_IN_MEMORY_MODE) {
      await autoSeed();
    }
    if (global.IS_IN_MEMORY_MODE) {
      return res.json(store.categories);
    }
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  // EN: Validate the name, prevent duplicates, derive a slug, and save through the selected store; SI: නාමය තහවුරු කර duplicates වළක්වා slug සාදා තෝරාගත් store එකේ සුරකියි.
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    if (global.IS_IN_MEMORY_MODE) {
      const exists = store.categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (exists) return res.status(400).json({ message: 'Category already exists' });

      const newCat = {
        _id: `cat_${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        description: description || '',
        icon: icon || 'grid',
      };
      store.categories.push(newCat);
      return res.status(201).json(newCat);
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, slug, description: description || '', icon: icon || 'grid' });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  // EN: Remove the requested category and return not-found for missing MongoDB records; SI: ඉල්ලූ category එක ඉවත් කර MongoDB record නොමැති නම් not-found ලබා දෙයි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      store.categories = store.categories.filter((c) => c._id !== req.params.id);
      return res.json({ message: 'Category deleted' });
    }
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: req.params.id });
      res.json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
