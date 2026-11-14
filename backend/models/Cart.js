// EN: Cart model stores one user's product lines and their calculated total; SI: එක් user කෙනෙකුගේ product items සහ ගණනය කළ එකතුව Cart model තුළ තබයි.
const mongoose = require('mongoose');

// EN: Nested schema defines each cart line and references its product document; SI: nested schema එක cart line එකක් නිර්වචනය කර product document එකට reference කරයි.
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
