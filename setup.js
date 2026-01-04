const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = __dirname;
const contentDir = path.join(projectDir, 'content');
const themeDir = path.join(projectDir, 'themes', 'PaperMod');

// Helper to run commands
function runCmd(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit', cwd: projectDir });
    } catch (error) {
        console.error(`Error executing ${command}:`, error);
        // Don't exit, try to continue if possible (e.g. if git init already done)
    }
}

// 1. Initialize Hugo Site
if (!fs.existsSync(path.join(projectDir, 'hugo.toml'))) {
    console.log('Initializing Hugo site...');
    runCmd('hugo new site . --force --format toml');
}

// 2. Initialize Git and add Theme
if (!fs.existsSync(path.join(projectDir, '.git'))) {
    console.log('Initializing Git...');
    runCmd('git init');
}

if (!fs.existsSync(themeDir)) {
    console.log('Adding PaperMod theme...');
    runCmd('git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod');
    runCmd('git submodule update --init --recursive'); // Ensure it's pulled
}

// 3. Create Configuration (hugo.toml)
const hugoConfig = `baseURL = "/"
languageCode = "zh-cn"
title = "MyPrivateVault"
theme = "PaperMod"
enableRobotsTXT = true
enableEmoji = true

[markup.goldmark.renderer]
  unsafe = true # Allow HTML for video embedding

[markup.highlight]
  style = "dracula"
  noClasses = false
  lineNos = true
  
[services]
  [services.googleAnalytics]
    ID = ""

[params]
  env = "production"
  description = "Personal Knowledge Vault"
  author = "Me"
  defaultTheme = "auto" # dark, light, or auto
  ShowReadingTime = true
  ShowShareButtons = false
  ShowPostNavLinks = true
  ShowBreadCrumbs = true
  ShowCodeCopyButtons = true
  
  # Search Configuration
  [params.fuseOpts]
    isCaseSensitive = false
    shouldSort = true
    location = 0
    distance = 1000
    threshold = 0.4
    minMatchCharLength = 0
    keys = ["title", "permalink", "summary", "content"]

[outputs]
  home = ["HTML", "RSS", "JSON"] # JSON for search

[menu]
  [[menu.main]]
    identifier = "tech"
    name = "技术笔记"
    url = "/tech/"
    weight = 10
  [[menu.main]]
    identifier = "reading"
    name = "读书分享"
    url = "/reading/"
    weight = 20
  [[menu.main]]
    identifier = "travel"
    name = "旅游徒步"
    url = "/travel/"
    weight = 30
  [[menu.main]]
    identifier = "entertainment"
    name = "游戏视频"
    url = "/entertainment/"
    weight = 40
`;

console.log('Writing hugo.toml...');
fs.writeFileSync(path.join(projectDir, 'hugo.toml'), hugoConfig);

// 4. Create Directory Structure and _index.md
const sections = [
    { 
        id: 'tech', 
        title: 'Technical Notes', 
        weight: 10,
        content: `---
title: "技术笔记"
weight: 10
summary: "Coding, Algorithms, and System Design"
---
` 
    },
    { 
        id: 'reading', 
        title: 'Reading Logs', 
        weight: 20, 
        content: `---
title: "读书分享"
weight: 20
summary: "Books I've read and thoughts"
---
` 
    },
    { 
        id: 'travel', 
        title: 'Travel & Hiking', 
        weight: 30, 
        content: `---
title: "旅游徒步"
weight: 30
summary: "The world is big, and I want to see it."
---
` 
    },
    { 
        id: 'entertainment', 
        title: 'Entertainment', 
        weight: 40, 
        content: `---
title: "游戏与视频"
weight: 40
summary: "Games, Movies and Videos"
---
` 
    }
];

sections.forEach(section => {
    const dir = path.join(contentDir, section.id);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, '_index.md'), section.content);
});

// 5. Create Sample Content
const samplePosts = [
    {
        path: 'tech/setup.md',
        content: `---
title: "Hugo Setup Guide"
date: 2023-10-01
draft: false
tags: ["hugo", "setup"]
categories: ["tech"]
---

## Introduction

This is a sample technical post showing code blocks.

\`\`\`javascript
console.log("Hello World");
const sum = (a, b) => a + b;
\`\`\`

## Configuration

Check out the \`hugo.toml\` for more settings.
`
    },
    {
        path: 'reading/the-pragmatic-programmer.md',
        content: `---
title: "The Pragmatic Programmer"
date: 2023-09-15
draft: false
tags: ["books", "coding"]
categories: ["reading"]
cover:
    image: "https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX396_BO1,204,203,200_.jpg"
    alt: "Cover"
    caption: "The Pragmatic Programmer"
---

## Thoughts

This book is a classic for a reason. It changed how I view software development.

> "Don't Live with Broken Windows"
`
    },
    {
        path: 'travel/first-hike.md',
        content: `---
title: "My First Hike"
date: 2023-08-20
draft: false
tags: ["hiking", "nature"]
categories: ["travel"]
---

## The View

Here is a photo from the summit.

![Mountain View](https://source.unsplash.com/random/800x600/?mountain)

It was a breathtaking experience.
`
    },
    {
        path: 'entertainment/favorite-video.md',
        content: `---
title: "Favorite YouTube Video"
date: 2023-10-05
draft: false
tags: ["video", "youtube"]
categories: ["entertainment"]
---

## Check this out

Here is a video embedded directly:

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=adS8C0s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
`
    }
];

samplePosts.forEach(post => {
    const filePath = path.join(contentDir, post.path);
    console.log(`Creating post: ${post.path}`);
    fs.writeFileSync(filePath, post.content);
});

console.log('Setup complete! Run "hugo server" to start.');
