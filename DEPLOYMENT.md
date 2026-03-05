# GitHub Pages 部署指南

本文档说明如何将 React Dynamic Island 演示网站部署到 GitHub Pages。

## 前置条件

1. 你的代码已经推送到 GitHub 仓库
2. 你有该仓库的管理员权限

## 部署步骤

### 1. 更新 Vite 配置

确保 `vite.config.ts` 中的 `base` 路径正确：

```typescript
export default defineConfig({
  base: '/react-dynamic-island/',  // 替换为你的仓库名称
  // ...
})
```

**重要**：`base` 必须是 `/你的仓库名称/`（注意前后的斜杠）

### 2. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**

### 3. 推送代码触发部署

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4. 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 你会看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待工作流完成（通常需要 2-3 分钟）

### 5. 访问你的网站

部署成功后，你的网站将在以下地址可用：

```
https://你的用户名.github.io/react-dynamic-island/
```

例如：`https://johndoe.github.io/react-dynamic-island/`

## 自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
git add .
git commit -m "Update demo"
git push origin main
```

## 手动触发部署

你也可以在 GitHub Actions 页面手动触发部署：

1. 进入 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 **Run workflow** 按钮
4. 选择分支并点击 **Run workflow**

## 故障排查

### 问题 1: 404 错误

**原因**：`base` 路径配置不正确

**解决方案**：
1. 检查 `vite.config.ts` 中的 `base` 是否与仓库名称匹配
2. 确保 `base` 格式为 `/仓库名称/`（前后都有斜杠）
3. 重新构建并推送

### 问题 2: 样式丢失

**原因**：资源路径不正确

**解决方案**：
- Vite 会自动处理资源路径，确保使用相对路径导入资源
- 检查 `index.html` 中的资源引用

### 问题 3: 部署失败

**原因**：测试失败或构建错误

**解决方案**：
1. 在本地运行 `npm test` 确保所有测试通过
2. 运行 `npm run build` 确保构建成功
3. 查看 GitHub Actions 日志获取详细错误信息

### 问题 4: Pages 设置中没有 "GitHub Actions" 选项

**原因**：仓库可能是私有的或者 GitHub Pages 未启用

**解决方案**：
1. 确保仓库是公开的（或者你有 GitHub Pro）
2. 检查仓库设置中 Pages 功能是否可用

## 工作流说明

`.github/workflows/deploy.yml` 文件定义了自动部署流程：

1. **触发条件**：推送到 `main` 分支或手动触发
2. **构建步骤**：
   - 检出代码
   - 安装 Node.js 20
   - 安装依赖
   - 运行测试
   - 构建项目
   - 上传构建产物
3. **部署步骤**：
   - 将构建产物部署到 GitHub Pages

## 本地预览

在推送之前，你可以本地预览构建后的网站：

```bash
npm run build
npm run preview
```

这会在 `http://localhost:4173` 启动一个预览服务器。

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 文件内容为你的域名，例如：`demo.yourdomain.com`
3. 在你的 DNS 提供商处添加 CNAME 记录指向 `你的用户名.github.io`
4. 推送代码，GitHub Pages 会自动识别

## 更多资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
