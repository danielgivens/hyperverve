module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*concat: {   
		    libs: {
		        src: [
		            'assets/js/vendor/jquery.js', 
		            'assets/js/vendor/video.js',
		            'assets/js/vendor/cycle.js', 
		            'assets/js/vendor/gsap.js', 
		            'assets/js/vendor/ScrollToPlugin.min.js',
		            'assets/js/plugins.js'
		        ],
		        dest: 'assets/js/libs.js',
		    },	    
		},*/
		watch: {
			options: {
		        livereload: true,
		    },
		    scripts: {
		        files: [
		        	'assets/css/*/*.scss',
		        	'assets/js/*.js',
		        	'assets/css/style.css',
		        	'*.php',
		        	'*.html'
		        ],
		        tasks: ['uglify', 'sass'],
		        options: {
		            spawn: false,
		        },
		    },    
		},	
		sass: {
			options: {
				loadPath: require('node-bourbon').includePaths,
				style: 'compressed'
			},			
			dist: {
				files: {
					'assets/css/style.css': 'assets/css/style.scss'
				}
			}
		},		
		uglify: {
		    base: {
		        src: 'assets/js/base.js',
		        dest: 'assets/js/base.min.js',
		    },
		},
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');	
	
    grunt.registerTask('work', ['watch','uglify','sass']);
    grunt.registerTask('build', ['uglify','sass']);
};