# koishi-plugin-what-to-eat | 今天吃什么

[![npm](https://img.shields.io/npm/v/koishi-plugin-what-to-eat?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-what-to-eat)

一个随机美食推荐插件，帮你解决"今天吃什么"的世界难题。

## 特性

- 🍽️ **海量美食库** — 内置数百种中餐、日料、小吃等美食，总有你没想到的
- 🎲 **随机推荐** — 每次随机推荐一道美食
- ☕ **饮品数据** — 附带饮品列表（`drink.json`），可自行扩展

## 命令

| 命令 | 别名 | 说明 |
|------|------|------|
| `/今天吃什么` | `吃什么`、`今天吃啥`、`吃啥` | 随机推荐一道美食 |

## 数据来源

- `food.json` — 主食/菜品列表（数百种）
- `drink.json` — 饮品列表，可结合使用

如需自定义菜单，直接编辑对应的 JSON 文件即可。

## 插件结构

```
data/what-to-eat/
├── drink.json       # 美食数据
└── food.json        # 饮品数据
external/koishi-plugin-what-to-eat/
├── src/
    └── index.ts
├── .editorconfig
├── .gitattributes
├── .gitignore
├── package.json
├── tsconfig.json
└── readme.md
```

## License

MIT
