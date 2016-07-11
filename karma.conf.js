var webpack = require("webpack");

var configSettings = {
	"normal": {},
	"uglified": {
		plugins: [
			new webpack.optimize.UglifyJsPlugin()
		]
	}
};

module.exports = config => {
    
  config.set({
      frameworks: ['mocha', 'chai', 'sinon'],
      // browsers: ['Chrome', 'PhantomJS', 'Firefox', 'IE'],
      browsers: ['PhantomJS'],
      basePath: '',
      files: [{
          pattern: 'node_modules/angular/angular.js',
          included: true,
          watched: false
        }, {
          pattern: 'node_modules/angular-route/angular-route.js',
          included: true,
          watched: false
        }, {
          pattern: 'node_modules/angular-resource/angular-resource.js',
          included: true,
          watched: false
        }, {
          pattern: 'node_modules/angular-mocks/angular-mocks.js',
          included: true,
          watched: false
        }, {
            // pattern: 'Build/Angular1/js/app.js',
            pattern: 'AngularApp/**/*.js',
            included: true,
            watched: true
        }, {
            pattern: 'specs/AngularAppSpecs/**/*.spec.js',
            included: true,
            watched: true
        }        
      ],
      preprocessors: {
        'Build/Angular1/js/app.js': ['coverage', 'webpack']
      },
      webpack: {
		resolve: {
			extensions: ["", ".js"]
		}
      }, webpackMiddleware: {
		stats: {
			colors: true
		}
      },
      coverageReporter: {
          dir: 'coverage/angular-test-coverage',
          reporters: [{
            type: 'html',
            subdir: 'report-html'
          }]
      },
      reporters: ['progress', 'coverage'],
      logLevel: config.LOG_INFO,
      colors: true,
      autoWatch: false,
      singleRun: true
  });
};