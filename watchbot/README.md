# WatchBot · Output 目录

WatchBot 的项目输出根目录：一个静态封面页 + 每个项目一个子目录。
封面列出全部项目，点击进入对应子目录的 `index.html`。

## 文件结构

```
output/
├── index.html          # 封面（所有项目卡片）
├── projects.json       # 项目清单（封面数据源）
└── <project>/          # 每个项目一个子目录
    └── index.html      # 项目自身页面
```

- `index.html` 与 `projects.json` **不要写死项目**，只负责列表
- 每个 `<project>/index.html` 必须是**自包含**的单页文档

## 添加新项目

发布新项目后，**只需两步**，无需改动 `index.html` 或任何 JS：

**1. 放入项目子目录**

```
output/<project>/
└── index.html
```

**2. 在 `projects.json` 顶部追加一条记录**

```json
[
  {
    "id": "01",
    "name": "<project>",
    "folder": "<project>",
    "description": "一行说明（≤30 字）",
    "accent": "#0066cc",
    "icon": "P"
  }
]
```

字段说明：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✓ | 显示编号，如 `"01"`，不足两位自动补 0 |
| `name` | ✓ | 卡片大标题 |
| `folder` | ✓ | 子目录名；链接拼为 `<folder>/index.html` |
| `description` | | 卡片描述（一行） |
| `accent` | | 卡片强调色（icon / meta / hover 顶条），缺省 `#0066cc` |
| `icon` | | icon 字符（单字），缺省取 `name` 首字母 |

约束：

- `folder` 与目录名必须完全一致
- 必须放在数组**最前面**（列表按数组顺序展示，可选）
- 主题色用项目本身在开发者圈里的代表色（TypeScript 蓝、VSCode 蓝等），保持克制

## 架构

```
浏览器访问 output/index.html
  ├─ fetch('projects.json')   → 渲染项目卡片网格
  └─ 点击卡片 → location.href = <folder>/index.html
```

要点：

- 主题跟随系统 `prefers-color-scheme`，浅色 `#ffffff` / 深色 `#000000`
- 卡片强调色通过 `--card-accent` CSS 变量注入，互不影响
- 列表为空 / 加载失败时显示提示文案，不抛错

## 部署

整个目录是纯静态资源，直接放到任意静态托管（GitHub Pages / Nginx / CDN）即可，**无后端、无构建步骤**。

```bash
# 本地预览
cd output
python3 -m http.server 8000
# 访问 http://localhost:8000
```
