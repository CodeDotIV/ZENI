# Fix GitHub Code Visibility

## Issue
The code might not be visible because GitHub is showing the `master` branch by default, but code was pushed to `main`.

## Solutions

### Option 1: Push to Master Branch (Quick Fix)
```bash
cd /Users/yellutla1.kumar/Desktop/app1
git push origin main:master
```

This pushes your `main` branch to `master` on GitHub.

### Option 2: Set Main as Default Branch on GitHub
1. Go to https://github.com/CodeDotIV/ZENI
2. Click **Settings** (in the repository)
3. Go to **Branches** section
4. Under **Default branch**, change from `master` to `main`
5. Click **Update** and confirm

### Option 3: View Main Branch Directly
Visit: https://github.com/CodeDotIV/ZENI/tree/main

This will show the `main` branch directly.

## Verify What's on GitHub

Check both branches:
- Main branch: https://github.com/CodeDotIV/ZENI/tree/main
- Master branch: https://github.com/CodeDotIV/ZENI/tree/master

## Current Status
- ✅ Code committed locally
- ✅ Pushed to `main` branch
- ⚠️  GitHub might be showing empty `master` branch by default

## Quick Fix Command
```bash
cd /Users/yellutla1.kumar/Desktop/app1
git push origin main:master
```

This will make your code visible on the default `master` branch.

