const path = require("path");

// 定义一个插件
class webpackPluginSvgIcons {
  // 构造函数，接收插件的配置项 options
  constructor(options) {
    // 获取配置项，初始化插件
    this.options = options;
  }

  // 插件安装时会调用 apply，并传入 compiler
  apply(compiler) {
    // 获取 comolier 独享，可以监听事件钩子
    // 功能开发 ...
    compiler.hooks.beforeRun.tap("CustomSvgoConfigPlugin", (compilation) => {
      console.log("Before running webpack...");
    });

    compiler.hooks.afterPlugins.tap("CustomSvgoConfigPlugin", (compiler) => {
      // 动态修改配置
      const config = compiler.options;
      // console.log("config:", config);

      // 如果配置中已经有 svgo-loader 规则，则修改它
      const rule = config.module.rules.find(
        (rule) => rule.loader && rule.loader.includes("svgo-loader")
      );

      if (rule) {
        // 修改 svgo-loader 的配置来去除 `fill` 属性
        rule.use[0].options.plugins = [
          {
            name: "removeAttrs",
            params: { attrs: "fill" },
          },
        ];
      } else {
        // 如果没有找到 svgo-loader 配置，则可以在这里添加它
        config.module.rules.push({
          test: /\.svg$/,
          include: [path.resolve("src/assets/icons")],
          use: [
            {
              loader: "svgo-loader",
              options: {
                plugins: [
                  {
                    name: "removeAttrs",
                    params: { attrs: "fill" },
                  },
                ],
              },
            },
          ],
        });
      }
    });
  }
}
module.exports = webpackPluginSvgIcons;
