const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        extraFiles: ['vcruntime140.dll'],
        generateUpdatesFilesForAllChannels: true,
        // publish: {
        //   provider: 's3',
        //   bucket: 'dolphin-anty-dist',
        //   region: 'eu-central-1'
        // },
        publish: {
          provider: 'github',
          releaseType: 'draft'
        },
        productName: 'Dolphin Anty',
        appId: 'com.ru.dolphin.anty',
        afterSign: 'sign/notarize.js',
        // asar: false,

        mac: {
          // asar: false,
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
          target: [
            {
              target: 'default',
              arch: 'universal'
            }
          ]
        },
        nsis: {
          artifactName: 'dolphin-anty-${os}-${arch}-${channel}.${ext}',
          perMachine: false,
          oneClick: false
        },
        linux: {
          target: 'AppImage'
        },
        // win: {
        //   target: [
        //     {
        //       target: "nsis",
        //       arch: [
        //         "x64",
        //         "ia32"
        //       ]
        //     }
        //   ]
        // },
        appImage: {
          artifactName: 'dolphin-anty-${os}-${arch}-${channel}.${ext}'
        },
        dmg: {
          artifactName: 'dolphin-anty-${os}-${arch}-${channel}.${ext}',
          sign: false,
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        }
      }
    }
  },
  configureWebpack: {
    externals: ['*'],
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    },
    devtool: 'source-map'
  }
}
