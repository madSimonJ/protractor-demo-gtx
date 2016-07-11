var webpack = require("webpack");

module.exports = config => {
    
  config.set({
      frameworks: ['mocha', 'chai', 'sinon'],
      browsers: ['Chrome', 'Firefox'],
      basePath: '',
      files: [{
          // pattern: 'Build/Angular1/js/app.min.js',
          pattern: 'AngularApp/app.js',
          included: true,
          watched: true
      }, {
          pattern: 'node_modules/angular-mocks/angular-mocks.js',
          included: true,
          watched: false
        }, {
            pattern: 'specs/AngularAppSpecs/**/*.spec.js',
            included: true,
            watched: true
        }],
      preprocessors: {
        //'specs/AngularAppSpecs/tests.js': ['babel', 'webpack', 'coverage'],
        // 'Build/Angular1/js/app.min.js': ['webpack'],
          'AngularApp/app.js': ['webpack', 'coverage']
        //'specs/AngularAppSpecs/**/*.spec.js': ['babel', 'webpack']
      },
      coverageReporter: {
          dir: 'coverage/angular-test-coverage',
          reporters: [{
            type: 'html',
            subdir: 'report-html'
          }]
      },
      reporters: ['spec', 'progress', 'coverage'],
      logLevel: config.LOG_INFO,
      colors: true,
      autoWatch: false,
      singleRun: true,
      webpack : {
             module: {
                loaders: [{
                    test: /\.js$/,
                    loaders: ['ng-annotate', 'babel-loader?{"presets":["es2015"]}'],
                    exclude: /node_modules/
                }, {
                    test: /\.js$/,
                    include: 'AngularApp/**/*.js',
                    loader: 'istanbul-instrumenter'
                }, {
                    test: /\.pug$/,
                    loader: 'pug-html-loader'
                }]

             }
     }
  });
};