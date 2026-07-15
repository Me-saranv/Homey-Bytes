# 📦 Homey Bytes - Complete Installation Guide

## 🎯 What You Get

This package includes everything needed to run your Homey Bytes website with:
- ✅ Professional customer website
- ✅ Admin dashboard with product management
- ✅ Order tracking with customer details
- ✅ **GitHub auto-sync** (saves products & orders to GitHub)
- ✅ Edit & Delete products
- ✅ Data backup/restore

---

## 📁 Folder Structure

```
homey-bytes/
├── 📄 index.html              ← Main file
├── 📄 README.md              ← Full documentation
├── 📄 GITHUB-SETUP.md        ← GitHub sync guide
├── 📄 INSTALLATION-GUIDE.md  ← This file
│
├── 📁 css/
│   ├── style.css             ← Website styling
│   └── admin.css             ← Admin styling
│
├── 📁 js/
│   ├── main.js               ← Website functions
│   ├── products.js           ← Product management
│   ├── admin.js              ← Admin dashboard
│   └── github-sync.js        ← GitHub synchronization
│
└── 📁 data/
    ├── products.json         ← Product storage
    └── orders.json          ← Order storage
```

---

## 🚀 Quick Start (5 Steps)

### Step 1: Create GitHub Repository
1. Go to github.com
2. Create new repository: `homey-bytes`
3. Keep it **PRIVATE**
4. **Don't initialize** with README

### Step 2: Upload Files
1. Click "Upload files" in repo
2. Upload all files from this package
3. **Keep folder structure** (css/, js/, data/)
4. Click "Commit changes"

### Step 3: Enable GitHub Pages
1. Go to Settings → Pages
2. Source: Main branch / root
3. Save
4. Wait 2-3 minutes
5. Your site will be live!

### Step 4: Connect GitHub Sync
1. Create Personal Access Token: https://github.com/settings/tokens
   - Name: `homey-bytes-sync`
   - Check: `repo`, `workflow`
   - Copy token (save securely!)

2. Open your website
3. Click ⚙️ → login `admin@2024`
4. Go to Settings → "GitHub Sync Setup"
5. Fill in:
   - Username: your GitHub username
   - Repo: homey-bytes
   - Token: paste your token
6. Click "Connect GitHub"
7. Click "Test Connection"

### Step 5: Start Using!
1. Click "➕ Add Product"
2. Add your first snack
3. Check GitHub repo - data auto-saved! 🎉

---

## 📚 Complete Feature List

### 🏠 Customer Website
- Hero section with call-to-action
- Product grid with images
- 100% Vegetarian badge
- WhatsApp order integration
- Contact information
- Responsive mobile design

### 👨‍💼 Admin Dashboard
**📈 Dashboard**
- Total products count
- Total orders count

**➕ Add/Edit Product**
- Product name, price, description
- Emoji/icon selection
- Category field
- Image upload
- **Edit existing products**
- Preview before saving

**📋 Product List**
- View all products in card format
- Edit button (click to edit)
- Delete button
- Live image preview

**📦 Orders & Customer Details**
- Date & time of order
- Product name
- Customer phone number
- Customer email
- Delete individual orders
- Clear all orders button

**⚙️ Settings**
- 🔗 GitHub Sync Setup
  - Username field
  - Repository name field
  - Token field
  - Test connection button
- 📞 Contact Information
  - WhatsApp number
  - Email address
  - Phone number
- 💾 Data Backup
  - Export to JSON
  - Import from JSON

---

## 🔗 GitHub Auto-Sync Features

### What Syncs
✅ Products (add, edit, delete)
✅ Orders with customer details
✅ All changes automatically

### How It Works
1. You add/edit product in admin
2. Saves to browser locally
3. Automatically sends to GitHub
4. File updated in your repo
5. Commit created with timestamp

### Benefits
- 🔒 Secure backup on GitHub
- 📱 Access from any device
- 📊 Version control & history
- 🔄 Never lose data
- ⚡ Instant sync

---

## 🔐 Security Setup

### GitHub Token
1. **Keep it secret!** Don't share
2. **Store securely** in password manager
3. **Update if exposed** (generate new)
4. It's only stored in your browser

### Repository Privacy
1. Keep repo **PRIVATE**
2. Share repo access only with team
3. Don't share token publicly

### Data Safety
- Encrypted in GitHub transit
- Your data stays in your repo
- Only you can access with token

---

## 💻 Technical Requirements

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

### What You Need
- GitHub account (free)
- Internet connection
- No backend/server needed
- All runs in browser

---

## 📖 How to Use Each Feature

### Adding Products
1. Admin → "➕ Add Product"
2. Fill: Name, Price, Description (required)
3. Optional: Emoji, Category, Image
4. Click "✅ Add/Update Product"
5. See in Products list & website immediately

### Editing Products
1. Admin → "📋 Products"
2. Find product → Click "✏️ Edit"
3. Form auto-fills
4. Change what you need
5. Click "✅ Add/Update Product"
6. Website updates instantly

### Viewing Orders
1. Admin → "📦 Orders"
2. See table with:
   - When ordered (date & time)
   - What they ordered (product name)
   - Their phone number
   - Their email address
3. Delete if needed

### Backup Data
1. Admin → Settings → "💾 Backup"
2. **Export**: Download JSON file
3. **Import**: Upload previous JSON

### GitHub Sync
1. Settings → "🔗 GitHub Sync"
2. Enter GitHub info
3. Click "🔗 Connect"
4. Click "🧪 Test"
5. Add product → Check GitHub!

---

## 🎨 Customization

### Change Colors
Edit `css/style.css` and `css/admin.css`:
```css
--primary: #8B4A6F        /* Main color */
--secondary: #C85A6F      /* Accent color */
--success: #27AE60        /* Button color */
```

### Change Admin Password
Edit `js/admin.js`:
```javascript
const ADMIN_PASSWORD = 'admin@2024';  // Change this
```

### Change Default Contact
Edit `index.html`:
```javascript
value="+91 8056580475"  // Your WhatsApp
```

---

## 🐛 Troubleshooting

### Products not showing
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check localStorage enabled
- Check JS files load (F12 → Console)

### Images not uploading
- Check file is JPG or PNG
- File size < 5MB
- Try different browser
- Check permissions

### GitHub sync not working
- Check token is correct
- Check username & repo name
- Run "Test Connection"
- Check internet connection
- Check F12 Console for errors

### Can't login to admin
- Password: `admin@2024`
- Check caps lock
- Clear browser data
- Try incognito window

---

## 📱 Mobile Optimization

Website is fully responsive for:
- Mobile phones (all sizes)
- Tablets
- Desktops
- Landscape & portrait

---

## ⚡ Performance Tips

1. **Compress images** before upload
   - Use online tool: TinyPNG.com
   - Keep under 500KB each

2. **Regular backups**
   - Export data weekly
   - Save to local drive
   - Have GitHub backup too

3. **Clear old orders**
   - Delete completed orders
   - Reduces data size
   - Keeps system fast

4. **Update products**
   - Keep descriptions fresh
   - Update prices as needed
   - Remove out-of-stock items

---

## 📞 Support Resources

### Documentation Files
1. **README.md** - Full feature docs
2. **GITHUB-SETUP.md** - GitHub sync guide
3. **INSTALLATION-GUIDE.md** - This file

### Browser Dev Tools (F12)
- **Console tab** - See error messages
- **Application** - View localStorage
- **Network** - Check API calls

### GitHub Docs
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Website loads at your GitHub URL
- [ ] Home page displays correctly
- [ ] Products show on website
- [ ] Admin login works (admin@2024)
- [ ] Can add new product
- [ ] Image upload works
- [ ] Product appears on website
- [ ] Product shows in "📋 Products" tab
- [ ] Can edit product
- [ ] Can delete product
- [ ] GitHub sync setup complete
- [ ] "Test Connection" passes
- [ ] Added product appears in GitHub repo
- [ ] Contact info updates correctly
- [ ] Export/Import works
- [ ] Mobile version looks good

---

## 🚀 Next Steps

1. ✅ Upload all files to GitHub
2. ✅ Enable GitHub Pages
3. ✅ Setup GitHub sync with token
4. ✅ Add your snack products
5. ✅ Upload product images
6. ✅ Update contact information
7. ✅ Share URL with customers
8. ✅ Start receiving orders!

---

## 💡 Pro Tips

### Bulk Import Products
1. Export existing data
2. Edit JSON file to add products
3. Import back
4. All products added at once

### Team Collaboration
1. Share GitHub repo access
2. Multiple people can see orders
3. View product history
4. See order timeline

### Data Analytics
GitHub shows:
- When products were added
- Order frequency
- Popular items
- Revenue trends

---

## 🎉 You're Ready!

Everything is set up for:
- ✅ Professional website
- ✅ Easy product management
- ✅ Customer order tracking
- ✅ Automatic GitHub backup
- ✅ Multi-device access

**Start adding products now!** Your data is safe on GitHub! 🚀

---

*For more help, see README.md and GITHUB-SETUP.md*
