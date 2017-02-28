import path from 'path'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import env from './env'
import manifest from './generate_manifest'
import commonConf from './common.config'

manifest(env.NODE_ENV === 'development')

const contentPath = path.join(__dirname, '../src', 'chrome_extension', 'content')

const devConf = {
  entry: {
    content: path.join(contentPath),
    content_loader: path.join(contentPath, 'dev.loader'),
  },
  devServer: {
    contentBase: 'build',
    host: env.HOST,
    port: env.PORT,
    hot: true,
    https: true,
    inline: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
}

const config = webpackMerge(commonConf, devConf)
const hotEntry = [...Object.keys(commonConf.entry), 'content']

hotEntry.forEach((entryName) => {
  config.entry[entryName] =
    [
      (`webpack-dev-server/client?https://${env.HOST}:${env.PORT}`),
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName])
})

module.exports = config
