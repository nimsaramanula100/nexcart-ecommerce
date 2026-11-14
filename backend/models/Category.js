// EN: Category model defines unique names/slugs and display metadata for product grouping; SI: products කාණ්ඩගත කිරීමට unique නාම/slugs සහ පෙන්වීමේ metadata Category model තුළ නිර්වචනය කරයි.
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'grid',
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
