# 书桌 · 个人简历网站

一个以"书桌"为概念的互动式个人品牌展示网站。手绘插画风格，点击桌面物品探索求职者的经历、技能与作品。

## 快速开始

```bash
# 方式一：直接打开
双击 index.html 即可在浏览器中预览

# 方式二：本地服务器（推荐，避免跨域问题）
npx serve .        # 或
python -m http.server 8080
```

## 项目结构

```
desk-resume/
├── index.html        # 主页面（引导页 + 书桌场景）
├── css/
│   └── style.css     # 全局样式 + 动画 + 暗黑模式
├── js/
│   ├── data.js       # 静态数据（修改内容只需编辑此文件）
│   └── main.js       # 交互逻辑（弹窗、翻页、模式切换）
├── assets/
│   ├── img/          # 图片素材
│   └── svg/          # SVG 插画（占位，待手绘替换）
└── README.md
```

## 部署（GitHub Pages）

1. 在 GitHub 创建公开仓库（如 `desk-resume`）
2. 推送代码至 `main` 分支
3. Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, 目录: `/ (root)`
4. 1-2 分钟后访问 `https://<用户名>.github.io/desk-resume/`

## 自定义内容

编辑 `js/data.js` 文件，修改 `APP_DATA` 对象中的内容，刷新页面即可看到更新。

## 待完成

- [ ] 手绘 SVG 插画（当前为几何占位版本）
- [ ] 替换 `assets/img/` 中的图片素材
- [ ] 书桌背景图替换为手绘版本
