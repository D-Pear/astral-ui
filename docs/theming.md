# 主题

覆盖主题变量：

```css
:root {
    --h-gold: #b88a4c;
    --h-radius: 0 16px 0 0;
}
```

| 变量                  | 含义       |
| --------------------- | ---------- |
| `--h-paper`           | 面板背景   |
| `--h-ink`             | 文字颜色   |
| `--h-gold`            | 强调色     |
| `--h-dark`            | 页面背景   |
| `--h-radius`          | 面板圆角   |
| `--h-font`            | 字体       |
| `--h-cursor`          | 光标       |
| `--h-scrollbar-thumb` | 滚动条颜色 |
| `--h-scrollbar-track` | 滚动条轨道 |
| `--h-scrollbar-gap`   | 滚动条间距 |

动画遵循系统的减少动态效果设置。设置 `document.documentElement.dataset.hMotion = 'reduced'` 可关闭动画。
