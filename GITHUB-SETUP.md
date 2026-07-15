# 🔗 GitHub Auto-Sync Setup Guide

## 📌 Overview
This guide explains how to set up GitHub synchronization so that:
- ✅ Products you add in admin panel are saved to GitHub
- ✅ Orders are automatically stored in GitHub
- ✅ Data persists even if you switch browsers
- ✅ Your GitHub repo becomes your backup

---

## 📋 Prerequisites
1. GitHub account (create free at github.com)
2. A repository for Homey Bytes
3. GitHub Personal Access Token

---

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name it: `homey-bytes-sync`
4. Check these boxes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)

5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
   - Looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Get Your GitHub Info

You need 2 pieces of information:
1. **GitHub Username** - e.g., `johndoe`
2. **Repository Name** - e.g., `homey-bytes`

Find these:
- Go to your repository: github.com/yourusername/repo-name
- Username: Your GitHub profile name
- Repo Name: The repository name

### Step 3: Connect in Admin Panel

1. Open your Homey Bytes website
2. Click ⚙️ and login with `admin@2024`
3. Go to **⚙️ Settings** tab
4. Scroll up to **"🔗 GitHub Sync Setup"**
5. Fill in:
   - **GitHub Username**: (your username)
   - **Repository Name**: (your repo name)
   - **GitHub Personal Access Token**: (paste the token)

6. Click **"🔗 Connect GitHub"**
7. Click **"🧪 Test Connection"** to verify it works

### Step 4: Start Adding Products!

Now whenever you:
- ✅ Add a product
- ✅ Edit a product
- ✅ Delete a product
- ✅ Receive an order

**Everything automatically syncs to GitHub!** 🎉

---

## 📊 What Gets Stored in GitHub

### `data/products.json`
Stores all your products:
```json
[
  {
    "id": 123456,
    "name": "Chakli",
    "price": 100,
    "desc": "Savory spiral snack",
    "emoji": "🌀",
    "category": "Savory",
    "image": "base64-encoded-image-here"
  }
]
```

### `data/orders.json`
Stores all customer orders:
```json
[
  {
    "id": 123456,
    "product": "Chakli",
    "phone": "+91 8056580475",
    "email": "customer@email.com",
    "timestamp": "2024-06-08T12:30:45.000Z"
  }
]
```

---

## ✨ Key Features

### Automatic Sync
- When you add/edit/delete products → saves to GitHub
- When customer orders → saved to GitHub
- Happens instantly! ⚡

### Version Control
- Every change creates a commit in GitHub
- You can see history of all changes
- Easy to rollback if needed

### Backup
- Your data is always backed up on GitHub
- Never lose product info
- Order history preserved

### Multi-Device
- Add products from different computers
- Data syncs to GitHub
- Access latest data from anywhere

---

## 🔐 Security Notes

### Token Safety
- ✅ Keep your token SECRET
- ❌ Don't share it publicly
- ❌ Don't commit it to GitHub
- ✅ It's only stored in your browser's localStorage

### Repository Privacy
- Keep your repo PRIVATE (not public)
- Token is needed to access your repo
- Only you can modify data

### Permissions
- The token only has access to your repo
- It can read and write files in `data/` folder
- Can't access other repos

---

## 🧪 Testing the Connection

1. Add a test product
2. Go to your GitHub repo
3. Open `data/products.json`
4. You should see your new product there!

If you don't see it:
- Check token is correct
- Check username and repo name are correct
- Click "🧪 Test Connection" button
- Check browser console for errors (F12)

---

## 🐛 Troubleshooting

### "Connection failed"
- ✅ Check username spelling
- ✅ Check repo name is correct
- ✅ Check token is not expired
- ✅ Make sure token has `repo` permission

### "Token expired"
- Generate new token (old one won't work)
- Update in Settings
- Click "Test Connection"

### Products not syncing
- Check internet connection
- Check "Test Connection" passes
- Check browser console (F12 → Console tab)
- Try adding product again

### GitHub API Limit
- GitHub allows 60 requests/hour for auth tokens
- Should be plenty for normal usage
- If hitting limit, wait 1 hour or upgrade token

---

## 📱 View Your Data on GitHub

1. Go to your GitHub repo
2. Open `data/products.json`
3. You'll see all your products!
4. Each change shows in commit history

### Commit History
- Click on `data/products.json`
- Click "History" tab
- See all changes with timestamps
- Can restore old versions if needed

---

## ⚙️ How It Works (Technical)

1. **Add Product**: You fill form → click button
2. **Save Locally**: Saves to browser's localStorage
3. **Sync to GitHub**: Automatically sends to GitHub API
4. **GitHub Stores**: File updated in your repo
5. **Commit Created**: Shows up in git history

All happens in background! ✨

---

## 🚀 Advanced Features

### Manual Export/Import
Still available in Settings:
- **📥 Export**: Download all data as JSON
- **📤 Import**: Upload previously exported data

### Backup Multiple Copies
- Export data regularly
- Save local copies
- Have GitHub as secondary backup

### Version Control Benefits
- See who made changes
- When products were added
- Complete history of orders
- Easy recovery of old data

---

## 📞 Need Help?

### Common Issues

**Q: Can I use public token?**
A: No! Always use PRIVATE repo with private token.

**Q: What if I lose the token?**
A: Generate new one, update in Settings, test connection.

**Q: Does data sync both ways?**
A: Currently one-way (admin → GitHub). Direct GitHub edits won't sync back.

**Q: Can team members access?**
A: Yes! Give them repo access and they can see data.

**Q: Is my data encrypted?**
A: Token is encrypted in GitHub's transit. Store token securely!

---

## ✅ Checklist

- [ ] Created GitHub account
- [ ] Created repository
- [ ] Generated Personal Access Token
- [ ] Copied token (saved securely)
- [ ] Noted username and repo name
- [ ] Connected in admin settings
- [ ] Tested connection (✅ sign)
- [ ] Added test product
- [ ] Verified on GitHub
- [ ] Ready to use!

---

## 🎉 You're Ready!

Your Homey Bytes website now has:
- ✅ Admin panel with product management
- ✅ Automatic GitHub sync
- ✅ Data backup and version control
- ✅ Order tracking
- ✅ Customer details storage

**Start adding products - they'll auto-save to GitHub!** 🚀

---

*Last updated: June 2024*
