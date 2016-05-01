module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		cssmin: {
			combine: {
				files: {
					'css/style.min.css': ['css/style.css']
				}
			}
		},

		concat: {
			dist: {
				src: ['js/app.js', 'js/mainCtrl.js', 'js/mainDirectives.js', 'js/mainFactory.js', 'js/mainFilters.js', 'js/mainSrvices.js'],
				dest: 'js/main.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	sgrunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['cssmin','concat']);

}