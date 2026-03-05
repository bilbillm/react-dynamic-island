# ⚡ 3 步快速部署

## 第 1 步：修改配置

打开 `vite.config.ts`，将第 7 行的仓库名称改为你的：

```typescript
base: '/你的仓库名称/',  // 👈 改这里
```

## 第 2 步：GitHub 设置

1. 打开你的 GitHub 仓库
2. **Settings** → **Pages** → **Source** → 选择 **GitHub Actions**

## 第 3 步：推送代码

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## ✨ 完成！

等待 2-3 分钟，访问：

```
https://你的用户名.github.io/你的仓库名称/
```

---

**需要帮助？** 查看 `DEPLOYMENT.md` 获取详细说明。
