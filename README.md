# 🍲 Homey Bytes - Complete Folder Structure

## 📁 Project Structure

```
homey-bytes/
├── index.html              (Main website & admin dashboard)
├── README.md              (This file)
│
├── css/
│   ├── style.css          (Main website styles)
│   └── admin.css          (Admin dashboard styles)
│
└── js/
    ├── main.js            (Website initialization & utilities)
    ├── products.js        (Product management - Add/Edit/Delete)
    └── admin.js           (Admin dashboard - Orders, Settings, etc)
```

---

## 🎯 Features

### ✅ Customer Website
- Home page with hero section
- Products grid with all items
- Product ordering via WhatsApp
- Contact information section

### ✅ Admin Dashboard (Password: `admin@2024`)

#### 📈 Dashboard
- Total products count
- Total orders count

#### ➕ Add Product
- Product Name
- Price
- Emoji/Icon
- Category
- Description
- Image Upload
- **EDIT OPTION** for existing products

#### 📋 Products List
- Shows all products in card format
- **Edit button** - Click to edit product
- **Delete button** - Remove product
- Live preview with image

#### 📦 Orders & Customer Details
- **Date & Time** - When order was placed
- **Product Name** - Which product was ordered
- **Customer Phone** - WhatsApp number
- **Customer Email** - Email address
- **Action** - Delete individual orders
- **Clear All** - Remove all orders

#### ⚙️ Settings
- WhatsApp number
- Email address
- Phone number
- Data backup (Export/Import JSON)

---

## 🚀 How to Use

### Upload to GitHub
1. Fork/create a repository
2. Upload all files maintaining folder structure:
   - index.html (root)
   - css/ folder with style.css and admin.css
   - js/ folder with all JS files

3. Enable GitHub Pages (Settings → Pages → Deploy from main branch)

### Login to Admin
1. Click ⚙️ on website
2. Enter password: **admin@2024**
3. You're in!

### Add Products
1. Click "➕ Add Product" in sidebar
2. Fill all fields (Name, Price, Description are required)
3. Upload image
4. Click "✅ Add/Update Product"
5. Product appears in Products tab AND website!

### Edit Products
1. Go to "📋 Products" tab
2. Find product and click "✏️ Edit"
3. Form fills with product details
4. Change what you need
5. Click "✅ Add/Update Product"

### View Orders
1. Go to "📦 Orders" tab
2. See all customer orders with:
   - When they ordered
   - What they ordered
   - Their phone number
   - Their email
3. Delete individual or clear all

---

## 📝 File Descriptions

### index.html
- Main HTML structure
- Customer website markup
- Admin dashboard markup
- Links all CSS and JS files

### css/style.css
- Website styling
- Header, hero, products
- Contact section
- Modal styles
- Responsive design

### css/admin.css
- Admin dashboard styling
- Sidebar, forms, tables
- Product cards
- Orders table
- Dashboard cards

### js/main.js
- Website initialization
- Check if admin logged in
- Load products on page load
- Smooth scrolling

### js/products.js
- Load/save products to localStorage
- Add new products
- **Edit existing products**
- Delete products
- Preview images
- Render product list
- Update website with products

### js/admin.js
- Admin login/logout
- Switch between tabs
- Dashboard data
- **Load and display orders with customer details**
- Save settings
- Export/import data

---

## 🔐 Security Notes

- Admin password is **admin@2024** (change if needed in code)
- All data stored in browser's localStorage
- No backend/server needed
- Data is local to each browser

---

## 💾 Data Storage

All data stored in browser localStorage:
- `products` - All product data
- `orders` - All customer orders
- `settings` - Contact info
- `adminLoggedIn` - Login status

---

## 📱 Responsive Design

Website is fully responsive for:
- Desktop
- Tablet
- Mobile

---

## ✨ Key Features

✅ **Product Management**
- Add products with images
- Edit existing products
- Delete products
- Multiple product photos

✅ **Order Tracking**
- See all customer orders
- Customer details (phone, email)
- Order timestamps
- Delete specific orders

✅ **Admin Controls**
- Secure login
- Data export/import
- Settings management
- Dashboard with stats

✅ **Website**
- Professional design
- Smooth animations
- Mobile responsive
- WhatsApp integration

---

## 🐛 Troubleshooting

**Products not showing?**
- Clear browser cache
- Check localStorage in Dev Tools
- Make sure JS files load correctly

**Images not uploading?**
- Check file is JPG or PNG
- File size < 5MB
- Try different browser

**Orders not saving?**
- Check if localStorage is enabled
- Clear browser cache
- Try incognito window

---

## 📞 Contact Info (Default)

- WhatsApp: +91 8056580475
- Email: Lakshsubyam57@gmail.com
- Phone: +91 8056580475

Change in Settings tab!

---

## 🎨 Customization

To change colors, edit CSS files:
- `--primary: #8B4A6F` (Main color)
- `--secondary: #C85A6F` (Accent color)
- `--success: #27AE60` (Button color)

---

Made with ❤️ for Homey Bytes
