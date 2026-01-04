# MyPrivateVault

个人知识管理与生活记录系统 (Private Knowledge & Life Vault)。
基于 [Hugo](https://gohugo.io/) 构建，使用 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 主题。

## 🚀 快速开始

### 1. 启动

项目已内置 Hugo Extended (v0.154.2)，无需配置环境变量。

直接双击运行根目录下的脚本：
👉 **`start.bat`**

或者在终端运行：
```powershell
.\bin\hugo.exe server -D
```

访问 `http://localhost:1313/` 即可预览。

### 2. 创建新内容

使用内置的 hugo 创建文件：

```powershell
# 创建技术笔记
.\bin\hugo.exe new content tech/my-new-post.md

# 创建读书笔记
.\bin\hugo.exe new content reading/book-name.md
```

## 🔒 私有化部署指南

本网站包含个人隐私内容，**严禁公开部署**。请选择以下任一方案进行私有化保护。

### 方案 A: Cloudflare Pages + Cloudflare Access (推荐)

这是最安全且免费额度够用的方案 (Zero Trust)。

1.  **部署到 Cloudflare Pages**:
    *   将代码推送到 GitHub 私有仓库。
    *   在 Cloudflare Dashboard 中选择 "Pages" -> "Connect to Git"。
    *   选择你的仓库，构建设置如下：
        *   **Build command**: `hugo --gc --minify` (Cloudflare 构建环境通常已预装 Hugo，如果版本过低，可指定环境变量 `HUGO_VERSION` 为 `0.154.2`)
        *   **Build output directory**: `public`
    *   等待部署完成，获得一个公开访问的 `*.pages.dev` 域名。

2.  **开启访问保护 (Cloudflare Access)**:
    *   进入 Cloudflare Dashboard -> **Zero Trust** (首次使用需免费开通 Team)。
    *   在左侧菜单选择 **Access** -> **Applications** -> **Add an application**。
    *   选择 **Self-hosted**。
    *   **Application Config**:
        *   **Application name**: My Vault
        *   **Session Duration**: 1 Month (免得频繁登录)
        *   **Application domain**: 输入你的 Pages 域名 (例如 `my-vault.pages.dev`)。
    *   **Identity Providers**:
        *   可以添加 "One-time PIN" (邮箱验证码) 或 GitHub 登录。
    *   **Policies (访问策略)**:
        *   **Action**: Allow
        *   **Include**: Emails -> 输入你自己的邮箱地址。
    *   保存。

现在，任何人访问你的域名都会被拦截，只有验证了你邮箱验证码的人才能进入。

### 方案 B: Vercel + Password Protection

Vercel 部署简单，但密码保护通常是 Pro 功能（或通过 Middleware 实现）。

1.  **部署到 Vercel**:
    *   导入 GitHub 仓库。
    *   Framework Preset 选择 **Hugo**。
    *   Deploy。

2.  **开启密码保护 (Deployment Protection)**:
    *   进入 Project Settings -> **Deployment Protection**。
    *   开启 **Vercel Authentication** (Standard Protection)。
    *   注意：Vercel 的密码保护功能在免费版 (Hobby) 上可能受限或仅对 Preview 分支有效。
    *   **替代方案**: 使用 Vercel Edge Middleware 实现 Basic Auth。在项目根目录创建 `middleware.ts` (需 Node环境配置) 或使用第三方库 `@vercel/edge` 来拦截请求。

**鉴于 Vercel 免费版对 Production 环境的密码保护限制，强烈建议使用方案 A (Cloudflare Access)。**

## 📂 目录结构

```text
content/
├── tech/           # 技术笔记 (代码、架构)
├── reading/        # 读书分享 (封面、读后感)
├── travel/         # 旅游徒步 (多图画廊)
└── entertainment/  # 游戏与视频 (视频嵌入)
bin/                # 内置 Hugo 执行文件
```

## 📝 配置说明

核心配置位于 `hugo.toml`。

- **搜索**: 已开启 Fuse.js 客户端搜索。
- **深色模式**: 自动跟随系统，也可手动切换。
- **HTML支持**: 允许在 Markdown 中嵌入 iframe (用于 YouTube/Bilibili)。
