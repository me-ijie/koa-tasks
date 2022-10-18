# Koa-Tasks

## 项目介绍
### 项目介绍

### 项目目录
```
.
├── app.js  //启动文件
├── config
│   └── index.js    //配置文件
├── controllers //接口单元目录
│   └── user.js     //用户接口
├── lib //自定义通用方法目录
│   ├── mysql.js    //封装myql使用
│   └── utils.js    //通用方法文件
├── package.json
├── README.md       
└── router
    └── index.js    //路由文件
```

### 项目启动
```js
yarn install //安装依赖, 没有建议安装一下替换npm管理, npm istall yarn -g
yarn dev // nodemon启动, 会监控项目文件修改, 自动重启
yarn start //node启动, 不会自动重启
```
