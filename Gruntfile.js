// https://github.com/closureplease/superstartup-closure-compiler#readme
var compiler = require('superstartup-closure-compiler');

/**
 * @see http://gruntjs.com/api/grunt
 * @param grunt
 * 	initConfig: function(configObject: Object.<string, Object>)
 * 	registerTask: function(taskName: string, taskList: Array.<string>) - taskList argument must be an array of task names
 * 	registerMultiTask: function(taskName: string, description: string, taskFunction: function())
 * 	renameTask: function(oldname: string, newname: string)
 * 	loadTasks: function(tasksPath: string)
 * 	loadNpmTasks: function(pluginName: string)
 * 	warn: function(error: string, errorcode: number=) errorcode: 0=success,
 * 																1=fatal,
 * 																2=missing gruntfile,
 * 																3=task error,
 * 																4=processing error,
 * 																5=invalid shell auto-completion
 * 																6=warning
 * 	option: function(optionName: string) : string
 * 	package: Object<String,Object> - The current Grunt package.json metadata, as an object.
 * 	version: string
 */
module.exports = function(grunt) {
	// Load Grunt tasks declared in the package.json file
//	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	require('load-grunt-tasks')(grunt);

//	var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;

	// Configure Grunt
	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),
		closureConfig: grunt.file.readJSON('closure.json'),

		// Copy Bower installed resources into our workspace (if we need fonts or bootstrap.js)
		// Bootstrap .less files are not copied - our .less files need to find them in ../bower_components/bootstrap/less
		// see: https://github.com/curist/grunt-bower
		// alternatives: https://github.com/mavdi/grunt-bower-organiser, https://github.com/yatskevich/grunt-bower-task
//		bower: {
//			dev: {
//				dest: 'dist',
//				js_dest: 'dist/js',
//				css_dest: 'dist/css',
//				options: {
//					packageSpecific: {
//						bootstrap: {
//							dest: 'fonts',
//							css_dest: '.delete-me',
//							less_dest: 'less/common/bootstrap'
//						}
//					}
//				}
//			}
//		},
		watch: {
			less: {
				files: ['less/*.less'],
				tasks: ['less'],
				options: { livereload: true }
			},
			javascript: {
				files: ['javascript/**/*.js'],
				tasks: ['closure'],
				options: { livereload: true }
			},
			test_html: {
				files: ['test/**/*.html'],
				tasks: ['copy:test_html'],
				options: { livereload: true }
			},
			test: {
				options: {
					livereload: true
				},
				files: [
					'javascript/**/*.js',
					'test/**/*.js'
				]
			}
		},
		// Start a connect web server on port 9000
		// see: https://github.com/gruntjs/grunt-contrib-connect
		connect: {
			options: {
				debug: true,
				port: 9000,
				hostname: 'localhost',	// change this to '0.0.0.0' to access the server from outside
				livereload: 35729
			},
// https://www.npmjs.org/package/grunt-connect-rewrite
//			rules: [
//				// Internal rewrite
//				{from: '.*dist/(.*)$', to: '$1'},
//				{from: '^.*/bower_components/(.*)$', to: '$1'} //, redirect: 'permanent'}
//			],
			test: {
				options: {
					base: ['bower_components', 'dist'] //, 'test']
//					middleware: function(connect) {
//						return [
//							connect.static(options.base),
//							mountFolder(connect, closureConfig.closureLibrary)
//						];
//					}
//					, middleware: function (connect, options) {
//						var middlewares = [];
//
//						// RewriteRules support
//						middlewares.push(rewriteRulesSnippet);
//
//						if (!Array.isArray(options.base)) {
//							options.base = [options.base];
//						}
//
//						var directory = options.directory || options.base[options.base.length - 1];
//						options.base.forEach(function (base) {
//							// Serve static files.
//							middlewares.push(connect.static(base));
//						});
//
//						// Make directory browse-able.
//						middlewares.push(connect.directory(directory));
//
//						return middlewares;
//					}
				}
			},
			'dist': {
				options: {
					base: 'dist'
					// Livereload needs connect to insert a javascript snippet in the pages it serves.
					// (looking at the source, it seems that this only works for "/" and "*.html"
					// ...so nested pages may require injecting the script manually:
					// "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':"
					// 	+ port + "/livereload.js?snipver=1\"><\\/script>"
					// This requires using a custom connect middleware
//					middleware: function(connect, options) {
//						return [
//							// Load the middleware provided by the livereload plugin
//							// that will take care of inserting the snippet
//							require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
//
//							// Serve the project folder
//							connect.static(options.base),
//// mountFolder is declared at the top of this file:
////							var mountFolder = function (connect, dir) {
////								return connect.static(require('path').resolve(dir));
////							};
//							mountFolder(connect, '<%= closureConfig.closureLibrary)
//						];
//					}
				}
			}
		},
		// Automatically open the browser at a given path
		open: {
			server: {
				// app: 'Google Chrome',	if not specified, default browser will be used
				path: 'http://localhost:<%= connect.options.port %>'
			},
			test: {
				path: 'http://localhost:<%= connect.test.options.port %>/test/'
			}
		},

		// Put files not handled in other tasks here
		copy: {
			test_html: {
				expand: true,
				cwd: 'test',
				src: ['{,*/}*.html', 'deps-test.js'],
				dest: 'dist',
				options: {
					process: function (content, srcpath) {
						console.info(srcpath);
						return content.replace(/\.\.\/bower_components\//g, '')
//										.replace(/\.\.\/javascript/g, 'js')
										.replace(/\.\.\/dist\//, '');
					}
				}
			},
			test_raw: {
				expand: true,
				src: 'javascript/**/*',
				dest: 'dist'
			}

//			dist: {
//				files: [{
//					expand: true,
//					dot: true,
//					cwd: '<%= yeoman.app %>',
//					dest: '<%= yeoman.dist %>',
//					src: [
//						'*.{ico,png,txt}',
//						'.htaccess',
//						'images/{,*/}*.{webp,gif}',
//						'styles/fonts/{,*/}*.*',
//						'bower_components/sass-bootstrap/fonts/*.*'
//					]
//				}]
//			},
//			styles: {
//				expand: true,
//				dot: true,
//				cwd: '<%= yeoman.app %>/styles',
//				dest: '.tmp/styles/',
//				src: '{,*/}*.css'
//				options: {
//					process: function (content, srcpath) {
//						return content.replace(/[sad ]/g,"_");
//					}
//				}
//			}
		},

		//
		// Test tasks
		// http://visionmedia.github.io/mocha/
//		mocha: {
//			all: {
//				options: {
//					run: true,
//					ignoreLeaks: false,
//					urls: [
//						'http://localhost:<%= connect.test.options.port %>/test/index.html',
//						'http://localhost:<%= connect.test.options.port %>/test/index.html?compiled=true',
//						'http://localhost:<%= connect.test.options.port %>/test/index.html?unit=true'
//					]
//				}
//			}
//		},
//		// Copied from https://github.com/ahabra/webappTemplate/blob/master/grunt.js
//		jasmine : {
//			src : gruntSupport.getVendorDependency().concat(['src/main/webapp/js/**/*.js']),
//			specs : 'src/test/js/jasmine-specs/**/*_spec.js',
//			timeout : 5000,
//			junit : {
//				output : 'target/jasmine/'
//			},
//			phantomjs : {
//				'ignore-ssl-errors' : true
//			}
//		}

		//
		// Closure Tools Tasks
		//
		// Dependency & Compiling
		//
		closureDepsWriter: {
			options: {
				closureLibraryPath: '<%= closureConfig.closureLibrary %>'
			},
			test: {
				options: {
					root_with_prefix: [
						'"test ../test"',
						'"<%= closureConfig.jsSrcPath %> ../../../../javascript"'
//						'"<%= closureConfig.componentPath %> ../bower_components"'
					]
				},
				dest: 'test/deps-test.js'
			},
			dist: {
				options: {
					root_with_prefix: [
						'"<%= closureConfig.jsSrcPath %> ../javascript"'
//						'"<%= closureConfig.componentPath %> ../bower_components"'
					]
				},
				dest: '<%= closureConfig.jsSrcPath %>/deps.js'
			}
		},
		closureBuilder: {
			options: {
				closureLibraryPath: '<%= closureConfig.closureLibrary %>',
				//inputs: ['<%= closureConfig.jsSrcPath %>/<%= closureConfig.bootstrapFile %>'],
				inputs: ['<%= closureConfig.jsSrcPath %>/bootstrap3/Button.js'],
//				paths: '<%= closureConfig.closureLibrary %>',
				compile: true,
				compilerFile: compiler.getPath(),
				compilerOpts: {
					debug: true,
					js: [
//						'<%= closureConfig.closureLibrary %>/closure/goog/deps.js',
//						'<%= closureConfig.jsSrcPath %>/deps.js'
					],
					compilation_level: 'ADVANCED_OPTIMIZATIONS',
//					externs: ['<%= closureConfig.externsPath %>/*.js'],
//					define: [
//						'\'goog.DEBUG=false\''
//					],
					warning_level: 'verbose',
					jscomp_off: ['checkTypes', 'fileoverviewTags']
//					summary_detail_level: 3,
//					only_closure_dependencies: null,
//					closure_entry_point: closureConfig.entryPoint,
//					create_source_map: closureConfig.sourceMap,
//					source_map_format: 'V3',
//					output_wrapper: closureConfig.outputWrapper
				}
			},
			test: {
//				options: {
//					compilerFile: compiler.getPath()
////					compile: true
//				},
				src: [
					'<%= closureConfig.closureLibrary %>',
					'<%= closureConfig.jsSrcPath %>'
//					'<%= closureConfig.jsSrcPath %>/bootstrap'
//					'<%= closureConfig.jsSrcPath %>/bootstrap3',
//					'D:\\Nick\\workspace\\starjobs\\closure-bootstrap\\bower_components\\closure-library'

//					'<%= closureConfig.closureLibrary %>/closure'
//					'<%= closureConfig.closureLibrary %>/third_party'
//					'<%= closureConfig.componentPath %>'
				],
				dest: 'test/js/<%= package.name %>.js'
			},
			dist: {
				src: [
					'<%= closureConfig.jsSrcPath %>/bootstrap',
					'<%= closureConfig.jsSrcPath %>/bootstrap3',
					'<%= closureConfig.closureLibrary %>/closure',
					'<%= closureConfig.closureLibrary %>/third_party'
//					'<%= closureConfig.componentPath %>'
				],
				dest: 'dist/js/<%= package.name %>.js'
			}
		},

		// clean, uglify and concat aid in building
		clean: {
			dist: ['.delete-me', 'temp', 'dist'],
			server: 'temp'
		},
//		uglify: {
//			vendor: {
//				files: {
//					'temp/vendor.js': closureConfig.vendorFiles
//				}
//			}
//		},
//		concat: {
//			production: {
//				src: ['temp/vendor.js', 'temp/compiled.js'],
//				dest: closureConfig.destCompiled
//			}
//		},

		less: {
			test: {
				options: {
//					paths: ["assets/css"],
					sourceMap: true,
					report: true
				},
				files: {
					"dist/css/closure-bootstrap.css": "less/_closure-bootstrap.less",
					"dist/css/autocomplete.css": "less/autocomplete.less"
				}
			},
			dist: {
				options: {
//					paths: ["assets/css"],
					cleancss: true,
					report: true
				},
				files: {
					"dist/css/closure-bootstrap.css": "less/closure-bootstrap.less"
				}
			}
		}
	}); // end grunt.initConfig();

	grunt.registerTask('test-raw', [
		'clean:server',
//		'bower',
		'less:test',
		'closureDepsWriter:test',
//		'configureRewriteRules',
		'copy:test_html',
		'copy:test_raw',
		'connect:test',
//		'open:test',
		'watch'
	]);

	grunt.registerTask('test-compiled', [
		'clean:server',
//		'bower',
		'less:test',
		'closureDepsWriter:test',
		'closureBuilder:test',
//		'configureRewriteRules',
		'copy:test_html',
		'connect:test',
//		'open:test',
		'watch'
	]);

	grunt.registerTask('default', [
		'clean:dist',
//		'bower',
//		'uglify:vendor',
		'less:dist',
		'closureDepsWriter:dist',
		'closureBuilder:dist'
//		'concat:production'
	]);

	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};
