# How to View Code on GitHub

## The Issue
GitHub repository has two branches:
- `master` - Only has LICENSE file (default branch)
- `main` - Has all your code (64 files)

GitHub is probably showing the `master` branch by default, which is why you don't see the code.

## Quick Solutions

### Solution 1: View Main Branch Directly
**Click this link to see your code:**
👉 https://github.com/CodeDotIV/ZENI/tree/main

This will show all your files on the `main` branch.

### Solution 2: Change Default Branch on GitHub
1. Go to: https://github.com/CodeDotIV/ZENI
2. Click **Settings** (top right of repository)
3. Scroll to **Branches** section
4. Under **Default branch**, click the switch icon
5. Select `main` as the default branch
6. Click **Update** and confirm

After this, the main page will show your code automatically.

### Solution 3: Force Push to Master (Alternative)
If you want `master` to have the code instead:

```bash
cd /Users/yellutla1.kumar/Desktop/app1
git push origin main:master --force
```

⚠️ **Warning**: This will overwrite the master branch. Only do this if you're sure.

## Verify Your Code is There

Check these URLs:
- Main branch: https://github.com/CodeDotIV/ZENI/tree/main ✅ (Has all code)
- Master branch: https://github.com/CodeDotIV/ZENI/tree/master (Only LICENSE)

## Recommended Action

**Just visit: https://github.com/CodeDotIV/ZENI/tree/main**

Your code is definitely there on the `main` branch! The repository is just defaulting to show `master` which is empty.

---

**Your code is on GitHub - just switch to the `main` branch to see it!** 🎉

