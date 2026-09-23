# SHEIN LUXE — Full-Stack Premium E-Commerce Platform

> **Tagline:** High Fashion & Everything, Unbeatable Prices.  
> **Portfolio:** Full-Stack Software Engineering Project  
> **Tech Stack:** React 18 (Vite) + Node.js / Express.js + MongoDB / Dynamic Fallback Store + JWT Auth  
> **Deployment:** Vercel (Frontend & Serverless API Ready)

---

## 🌟 Project Overview

**SHEIN LUXE** is a premium, high-fashion e-commerce platform inspired by SHEIN. It features **50+ diverse products** across 10+ categories (Women's Fashion, Men's Fashion, Shoes, Bags, Beauty, Jewelry, Electronics, Home & Living, Sports, Kids), live flash deals with countdown timers, interactive wishlist management, promo coupon codes (`SHEINVIP`), interactive credit card simulation, and a full Administrator Control Panel.

---

## ✨ Key Platform Features

### 🛒 **Customer Experience**
- **SHEIN-Style Hero & Flash Sale Bar:** Live ticking countdown timer for flash deals, top announcement ticker, and VIP promo code banners.
- **50+ Dynamic Catalog:** Multi-category filtering (10+ departments), real-time search, price range filter, sorting options, and 3/4 column grid toggle.
- **Product Details Page:** Multi-image gallery thumbnail switcher, color swatch picker, size selection buttons, stock status, wishlist heart toggle, and tabbed details (Overview, Customer Reviews, Shipping).
- **Interactive Shopping Bag:** Free shipping progress tracker, promo coupon handler (`SHEINVIP` for 15% off, `FLASH20` for 20% off), color & size tags per item, itemized subtotal & shipping fees.
- **Animated Checkout:** Live credit card simulator card preview, multi-step shipping address form, and instant demo payment feedback.
- **Wishlist Portal:** Save favorite styles across browser sessions via local storage & context state.
- **Order Tracking:** Real-time order progress timeline (`Pending` -> `Processing` -> `Shipped` -> `Delivered`).

### 🛡️ **Administrator Control Panel**
- **Executive Analytics:** Store revenue metrics, order status counts, customer totals, and low-stock alerts.
- **Product Management:** Add, edit, or delete inventory with custom image URLs, colors, sizes, and trending tags.
- **Order Management:** Filter and update customer order statuses.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@nexcart.com` | `admin123` | Admin Portal, Product CRUD & Order Control |
| **Customer** | `john@example.com` | `user123` | Customer Portal, Cart, Wishlist & Checkout |

---

## 🚀 Deployment Instructions for GitHub & Vercel

### **Option 1: Deploy to Vercel (Recommended)**
1. Push this entire repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Build SHEIN LUXE Premium E-Commerce Platform"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect the configuration in `vercel.json` and deploy both the **frontend** and **serverless API**.
5. Your live site will be ready instantly with permanent Unsplash CDN image URLs and zero hardcoding!

---

## 🛠️ Local Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/shein-luxe-ecommerce.git
cd shein-luxe-ecommerce

# Install backend dependencies
cd backend
npm install
npm run dev # Starts server on http://localhost:5000

# Open a second terminal for frontend
cd frontend
npm install
npm run dev # Starts Vite on http://localhost:5173
```
