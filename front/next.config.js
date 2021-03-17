// require('dotenv').config(); 후 .env 파일에 ANALYZE 변수 설정 해도 되지만
// package.json의 script에 환경변수 설정 명령을 추가해도 가능 -> 명령 실행 시 config.json 훑으므로
// "build": "ANALYZE=true NODE_ENV=production next build",
// const CompressPlugin = require('compression-webpack-plugin');

// webpack 설정
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';
    const plugins = [
      ...config.plugins,
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
    ];

    // if (prod) {
    //   plugins.push(new CompressPlugin());
    // }
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins,
    };
  },
});
