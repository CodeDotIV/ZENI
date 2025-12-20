# Git Configuration for GitHub

## Current Git Configuration

Check your current git user settings:

```bash
git config --global user.name
git config --global user.email
```

## Set Up Git User (if not configured)

If you need to set up your git user for GitHub commits:

```bash
# Set your name (use your GitHub username or real name)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"
```

## Verify Configuration

```bash
git config --list | grep user
```

## Initialize Git Repository (if needed)

If this isn't a git repository yet:

```bash
cd /Users/yellutla1.kumar/Desktop/app1
git init
git add .
git commit -m "Initial commit: ZENI project setup"
```

## Connect to GitHub

1. **Create a repository on GitHub** (if you haven't already)

2. **Add remote:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/zeni.git
# Or with SSH:
git remote add origin git@github.com:YOUR_USERNAME/zeni.git
```

3. **Push to GitHub:**
```bash
git branch -M main
git push -u origin main
```

## Check Current Status

```bash
# Check if git is initialized
git status

# Check remote (if configured)
git remote -v
```

## Important Notes

- Use the **same email** that's associated with your GitHub account
- Your commits will be linked to your GitHub profile
- You can verify commits are linked by checking your GitHub contributions graph

