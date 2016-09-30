module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {   
		    libs: {
		        src: [
		            'assets/js/three.min.js', 
		            'assets/js/libs/tween.min.js', 
		            'assets/js/loaders/BinaryLoader.js',
		            'assets/js/shaders/CopyShader.js',
		            'assets/js/shaders/DigitalGlitch.js',
		            'assets/js/postprocessing/EffectComposer.js',
		            'assets/js/postprocessing/RenderPass.js',
		            'assets/js/postprocessing/MaskPass.js',
		            'assets/js/postprocessing/ShaderPass.js',
		            'assets/js/postprocessing/GlitchPass.js'
		        ],
		        dest: 'assets/js/bundle.js',
		    },	    
		},
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
		    plugins: {
		        src: 'assets/js/plugins.js',
		        dest: 'assets/js/plugins.min.js',
		    },
		},
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');	
	
    grunt.registerTask('work', ['watch','uglify','sass','concat']);
    grunt.registerTask('build', ['uglify','sass','concat']);
};