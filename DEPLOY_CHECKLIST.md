# 🚀 GitHub Pages 部署清单

按照以下步骤快速部署你的 Dynamic Island 演示网站：

## ✅ 部署前检查

- [ ] 确保代码已推送到 GitHub
- [ ] 确保所有测试通过：`npm test`
- [ ] 确保本地构建成功：`npm run build`

## 📝 配置步骤

### 1. 更新 vite.config.ts

```typescript
base: '/你的仓库名称/',  // ⚠️ 必须替换为实际仓库名
```

**示例**：
- 仓库名：`react-dynamic-island`
- 配置：`base: '/react-dynamic-island/'`

### 2. GitHub 仓库设置

1. 进入仓库 → **Settings**
2. 左侧菜单 → **Pages**
3. **Source** → 选择 **GitHub Actions**

### 3. 推送代码

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

## 🎯 验证部署

- [ ] 进入 **Actions** 标签页
- [ ] 等待 "Deploy to GitHub Pages" 工作流完成（绿色✓）
- [ ] 访问：`https://你的用户名.github.io/你的仓库名称/`

## 🔧 如果遇到问题

### 404 错误
```bash
# 检查 vite.config.ts 中的 base 路径
# 确保格式：/仓库名称/（前后都有斜杠）
```

### 构建失败
```bash
# 本地测试
npm test
npm run build

# 查看 GitHub Actions 日志
```

### 样式丢失
```bash
# 清除缓存重新构建
rm -rf dist node_modules
npm install
npm run build
```

## 📦 文件清单

已创建的文件：
- ✅ `.github/workflows/deploy.yml` - GitHub Actions 工作流
- ✅ `vite.config.ts` - 已添加 base 路径
- ✅ `DEPLOYMENT.md` - 详细部署文档
- ✅ `DEPLOY_CHECKLIST.md` - 本清单

## 🎉 完成！

部署成功后，你的网站将在以下地址可用：

```
https://你的用户名.github.io/你的仓库名称/
```

每次推送到 `main` 分支都会自动重新部署。
