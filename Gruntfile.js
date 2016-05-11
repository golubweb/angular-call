module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			dist: {
				src: ['app/app.js',
				      'app/routes.js', 
				      'app/*/mainCtrl.js', 
				      'app/*/itemCtrl.js', 
				      'app/*/paginationCtrl.js', 
				      'app/*/searchCtrl.js', 
				      'app/*/audios.js', 
				      'app/*/pagination.js', 
				      'app/*/audioSource.js', 
				      'app/*/searchForm.js', 
				      'app/*/numberScore.js', 
				      'app/*/numberDuration.js', 
				      'app/*/numberDays.js', 
				      'app/*/numberAgent.js', 
				      'app/*/storageFactory.js', 
				      'app/*/trustUrl.js', 
				      'app/*/moment.js', 
				      'app/*/orderOneItem.js', 
				      'app/*/durationConvert.js', 
				      'app/*/dateConvert.js', 
				      'app/*/callServices.js'
				],
				dest: 'dist/app.js'
			}
		},

		cssmin: {
			combine: {
				files: {
					'dist/style.min.css': ['assets/css/style.css', 'assets/css/responsiv.css']
				}
			}
		}
		
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['cssmin', 'concat']);

}