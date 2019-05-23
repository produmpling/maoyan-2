## 影票多多
🎬仿猫眼电影微信小程序，带`Vue`管理后台和`Node+Express`接口服务。

## 环境依赖
- Node v8.11.1
- MySQL v5.7
- Redis

## 配置说明
在项目运行前，请保证每个配置的正确性。
- 管理端配置`/admin/static/config/`，其中`dev.config.js`是本地开发时的配置，`prod.config.js`是打包后线上使用的配置。
- 小程序端配置待抽离，目前请求地址是直接写在js里，要修改的话暂且先全局搜索替换。
- 接口服务配置`/server/config`，其中`dev.js`是本地开发时的配置，`prod.js`是线上使用的配置。

## 运行步骤
1. 创建数据库并导入根目录sql的脚本；
2. 进入admin和server目录执行`npm i`后，再`npm start`，分别启动管理端和接口服务；
3. 打开微信开发者工具，导入app目录启动小程序端。

## 项目结构
```
.
├── admin             // 管理端
├── app               // 小程序端
└── server            // 接口服务

```