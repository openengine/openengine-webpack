import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import nodemon from 'nodemon';
import path from 'path';
import schema from './src/server/data/schema';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';
import fs from 'fs';
import concatCss from 'gulp-concat-css';
import gls from 'gulp-live-server';
import clean from 'gulp-clean';
import babel from 'gulp-babel';

import configs from './webpack.config';
import prodConfigs from './webpack-prod.config';

const [ frontendConfig, backendConfig ] = configs;
const [ prodFrontendConfig, prodBackendConfig ] = prodConfigs;

let buildDir = 'build'; //process.env.ENV_VARIABLE==='production'?'production':'build';

let compiler;

// trigger a manual recompilation of webpack(frontendConfig);
function recompile() {
  if (!compiler)
    return null;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err)
        reject(err);
      console.log('[webpackDevServer]: recompiled');
      resolve();
    });
  });
}

// Cleans out build folder prior to compiling and copying assets
gulp.task('clean-build', () => {
  return gulp.src(path.join(__dirname, buildDir,'public'), {read: false}).pipe(clean());
});

// run the webpack dev server
//  must generate the schema.json first as compiler relies on it for babel-relay-plugin
gulp.task('webpack', ['copy-assets','generate-schema', 'watch-schema'], () => {
  compiler = webpack(frontendConfig);
  let server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'build', 'public'),
    hot: true,
    noInfo: true,
    stats: { colors: true },
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:8080'
    }
  });
  server.listen(3000, 'localhost', (err, result) => {
    if (err)
      return console.error(err);
    console.log('[webpackDevServer]: listening on localhost:3000');
  });
});

// Copy all static assets, also concatinates css files into 1 file
gulp.task('copy-assets', ['clean-build'], () => {
  gulp.src(path.join(__dirname, './src/frontend/assets/img/**')).pipe(gulp.dest(path.join(__dirname, buildDir,'public','img')));
  // gulp.src(path.join(__dirname, './src/frontend/assets/styles/**')).pipe(concatCss("engine.css")).pipe(gulp.dest(path.join(__dirname,'build','public','css')));
  });


// Runs our combined production tasks using the webpack-prod.config.js file
gulp.task('production-run', () => {
  
  // run webpack backend server (will start server after all assets are ready)
  webpack(prodBackendConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack-prod:build", err);

    //1. run your script as a server
      var server = gls(path.join(__dirname, buildDir,'server.js'), undefined, false);
      server.start();
  });
});

// Generate the frontend production react relay static page and assets using the webpack-prod.config.js file
gulp.task('production-prep', ['copy-assets','generate-schema'], () => {

 return new Promise((resolve, reject) => {
    webpack(prodFrontendConfig, (err, stats) => {
         if(err) throw new gutil.PluginError("webpack-prod-front:build", err);

        resolve();
    });
  });
});

// Regenerate the graphql schema and recompile the frontend code that relies on schema.json
gulp.task('generate-schema', () => {
  return graphql(schema, introspectionQuery)
    .then(result => {
      if (result.errors)
        return console.error('[schema]: ERROR --', JSON.stringify(result.errors, null, 2), result);
      fs.writeFileSync(
        path.join(__dirname, './src/server/data/schema.json'),
        JSON.stringify(result, null, 2)
      );
      return compiler ? recompile() : null;
    });
});

// recompile the schema whenever .js files in data are updated
gulp.task('watch-schema', () => {
  gulp.watch(path.join(__dirname, './src/server/data', '**/*.js'), ['generate-schema']);
});

// restart the backend server whenever a required file from backend is updated
gulp.task('backend-watch', () => {
  return new Promise((resolve, reject) => {
    let compiled = false;
    webpack(backendConfig).watch(100, (err, stats) => {
      if (err)
        return reject(err);
      // trigger task completion after first compile
      if (!compiled) {
        compiled = true;
        resolve();
      } else {
        nodemon.restart();
      }
    });
  });
});

// rebundle the asset files if they are updated
// gulp.task('watch-assets', () => {
//   gulp.watch(path.join(__dirname, './src/frontend/assets', '**/*.css'), ['copy-assets']);
// });

// gulp.task('server', ['backend-watch', 'watch-schema'], () => {
//   nodemon({
//     execMap: {
//       js: 'node'
//     },
//     script: path.join(__dirname, 'build', 'server.js'),
//     // do not watch any directory/files to refresh
//     // all refreshes should be manual
//     watch: ['foo/'],
//     ext: 'noop',
//     ignore: ['*']
//   }).on('restart', () => {
//     console.log('[nodemon]: restart');
//   });
// });

gulp.task('default', ['webpack']);
