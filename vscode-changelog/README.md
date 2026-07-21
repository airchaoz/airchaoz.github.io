# VS Code Changelog 输出目录

`novalog` 自动生成的 VS Code 更新日志（HTML）发布目录，包含一个静态导航页和所有版本正文。

## 文件结构

```
output/vscode-changelog/
├── index.html              # 导航页（左侧目录 + 右侧 iframe 正文）
├── versions.json           # 版本清单（侧栏数据源）
└── 1.<x>_<中文标签>.html   # 每个版本一个独立 HTML（iframe 直接整页加载）
```

- `index.html` 与 `versions.json` **不要手写正文**，只负责导航
- 每个 `1.x_*.html` 必须是**自包含**的单页文档（自带 `<style>` / `<body>` / 内容）

## 添加新版本

发布新版本后，**只需两步**，无需改动 `index.html` 或任何 JS：

**1. 放入新版本 HTML**

```
output/vscode-changelog/1.130_<中文标签>.html
```

**2. 在 `versions.json` 顶部追加一条记录**

```json
[
  {
    "version": "1.130",
    "label":   "1.130_<中文标签>",
    "file":    "1.130_<中文标签>.html"
  },
  { "version": "1.129", ... }
]
```

约束：

- `label` 与 `file` 的中文标签必须完全一致
- 必须放在数组**最前面**（侧栏按数组顺序展示，`versions[0]` 作为默认加载项）
- `file` 不带路径，只写文件名（同目录相对加载）

## 架构

```
浏览器访问 index.html
  ├─ fetch('versions.json')   → 渲染左侧版本列表
  └─ 首次自动加载 versions[0]  → iframe 嵌入对应 HTML
       └─ 点击侧栏项 → loadVersion(file) → 切换 iframe.src
```

要点：

- 侧栏 iframe 走 `in-flow` 布局（`width: 80vw; margin-left: 20vw`），body 自然纵向滚动承载 iframe 高度
- iframe 高度由 `index.html` 的 JS 通过读取 `body.scrollHeight` 自适应，避免撑高形成底部空白
- 主题跟随系统 `prefers-color-scheme`，浅色 `#ffffff` / 深色 `#000000`；所有版本 HTML 与导航页统一

## 部署

整个目录是纯静态资源，直接放到任意静态托管（GitHub Pages / Nginx / CDN）即可，**无后端、无构建步骤**。

```bash
# 本地预览
cd output/vscode-changelog
python3 -m http.server 8000
# 访问 http://localhost:8000
```
