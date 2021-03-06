import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
import gls from 'gulp-live-server';
import clean from 'gulp-clean';
import dotenv from 'dotenv-safe';
import { gutil } from 'gulp-babel';
import configs from './webpack.config';
import prodConfigs from './webpack-prod.config';

const [ frontendConfig] = configs;
const [ prodFrontendConfig, prodBackendConfig] = prodConfigs;

const buildDir = 'build'; // process.env.ENV_VARIABLE==='production'?'production':'build';

let compiler;

// Cleans out build folder prior to compiling and copying assets
gulp.task('clean-build', () => {
  return gulp.src(path.join(__dirname, buildDir, 'public'), {read: false}).pipe(clean());
});
// run the webpack dev server
gulp.task('webpack', ['copy-assets', 'set-dev-env'], () => {
  compiler = webpack(frontendConfig);
  const server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'build', 'public'),
    hot: true,
    noInfo: true,
    stats: { colors: true },
    historyApiFallback: true,
  });
  server.listen(3000, 'localhost', (err, result) => {
    if (err) {
      return console.error(err);
    }
    console.log('[webpackDevServer]: listening on localhost:3000');
  });
});
// Setup our environment variables to use in our dev environment
gulp.task('set-dev-env', () => {
  const envFiles = {
    development: '.env',
  };
  dotenv.config({
    path: envFiles[process.env.NODE_ENV],
  });
});
// Copy all static assets, also concatinates css files into 1 file
gulp.task('copy-assets', ['clean-build'], () => {
  gulp.src(path.join(__dirname, './src/frontend/assets/img/**')).pipe(gulp.dest(path.join(__dirname, buildDir, 'public', 'img')));
});
// Runs our combined production tasks using the webpack-prod.config.js file
gulp.task('production-run', () => {
  // run webpack backend server (will start server after all assets are ready)
  webpack(prodBackendConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack-prod:build', err);
    }
    // 1. run your script as a server
    const server = gls(path.join(__dirname, buildDir, 'server.js'), undefined, false);
    server.start();
  });
});
// Generate the frontend production react relay static page and assets using the webpack-prod.config.js file
gulp.task('production-prep', ['copy-assets'], () => {
  return new Promise((resolve, reject) => {
    webpack(prodFrontendConfig, (err, stats) => {
      if (err) {
        throw new gutil.PluginError('webpack-prod-front:build', err);
      }
      resolve();
    });
  });
});

gulp.task('default', ['webpack']);
