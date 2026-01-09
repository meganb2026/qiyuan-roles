# 部署指南

本指南将帮助你将 Twine 游戏部署到 GitHub Pages。

## 导出游戏文件

在部署前，你需要先导出HTML游戏文件：

### 步骤1：准备游戏文件

确保 `game.twee` 文件已生成：
```bash
./tools/build.sh
```

### 步骤2：导出HTML文件

1. 打开浏览器，访问 [Twine在线编辑器](https://twinery.org/)
2. 点击 **Import From File**
3. 选择项目中的 `game.twee` 文件
4. 导入成功后，点击 **Build** 菜单
5. 选择 **Publish to File**
6. 保存为 `game.html` 到项目根目录

### 步骤3：验证文件

确保项目根目录有以下文件：
- `index.html` - 游戏介绍页
- `game.html` - 实际游戏文件

## 部署到GitHub

### 自动部署

代码推送到main分支后，GitHub Actions会自动部署。

### 手动验证

1. 访问 `https://你的用户名.github.io/仓库名/`
2. 主页显示游戏介绍
3. 点击"开始游戏"进入实际游戏