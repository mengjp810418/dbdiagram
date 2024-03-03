# DB Diagram OSS (dbdiagram-oss)

An Open-Source dbdiagram.io

## Before all that, install the yarn(1.22.X) at windows10 or windows11 by npm, and add to user’s environment variable PATH like %LOCALAPPDATA%\yarn\bin
## detail for https://yarnpkg.com/getting-started/install
```cmd
npm install -g yarn
```


### Install the dependencies
### First, enter the web path like :C:\Nodejs\projects\dbdiagram-oss-wrep\web
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn lint
```

### Build the app for production
```bash
quasar build
```

### entery the builded path like dist/spa, and start the service for production
```bash
quasar serve --history --open
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
