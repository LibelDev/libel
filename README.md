<p align="center">
  <img src="./assets/logos/libel.png" alt="Libel" width="100"/>
  <h1 align="center">Libel</h1>
  <p align="center">Label users on LIHKG</p>
  <p align="center">
    <img src="./assets/demo.gif" alt="Demo" />
  </p>
</p>

***

## Installation / Usage

For the installation steps, usage and more details, please visit [Wiki](https://github.com/kitce/libel/wiki).
關於詳細介紹、安裝教學及使用教學，請閱讀 [Wiki](https://github.com/kitce/libel/wiki)。

***

## Development

*This section is for developers only.
此章節只供開發者瀏覽。*

### Install dependencies

```bash
pnpm install
```

For a smooth development experience, you may want to execute the following commands simultaneously:

### Start development

```bash
pnpm dev
```

### SCSS module typings

```bash
pnpm type:scss[:watch]
```

### Install

When `webpack-dev-server` completed the first compilation, follow these steps to test on [LIHKG](https://lihkg.com/):

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Visit [http://localhost:8080/libel.proxy.user.js](http://localhost:8080/libel.proxy.user.js)
3. Click **Install** / **Reinstall**
4. Go back to [LIHKG](https://lihkg.com/) and reload the page

Whenever you made changes and `webpack-dev-server` recompiled the files, repeat step 2 to 4.

***

## Distribution

### Build

```bash
pnpm build
```

The distributable files will be available in [`/dist`](https://github.com/kitce/libel/tree/master/dist)

***

## Disclaimer

This project only provides technical support for the [features](https://github.com/kitce/libel/wiki#%E5%8A%9F%E8%83%BD). The owner and contributors do not assume any legal responsibilities caused by the users. Users should be aware of and take the risks.

***

## Privacy Policy

[Privacy Policy](https://github.com/kitce/libel/wiki/%E7%A7%81%E9%9A%B1%E6%94%BF%E7%AD%96)

## License

MIT License
