module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			dist: {
				src: ['js/app.js', 'js/mainCtrl.js', 'js/mainDirectives.js', 'js/mainFactory.js', 'js/mainFilters.js', 'js/mainServices.js'],
				dest: 'js/main,js'
			}
		},

		cssmin: {
			combine: {
				files: {
					'css/style.min.css': ['css/style.css', 'css/responsiv.css']
				}
			}
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['cssmin','concat']);

}