var webpack = require('webpack');
module.exports = {
	context : __dirname,
	entry : {
		app : './js/TravelPlannerApp/app.js',
		vendor : [ "jquery", "angular", "bootstrap" ]
	},
	output : {
		path : __dirname + '/js/dist',
		filename : 'TravelPlannerApp.bundle.js'
	},
	resolve : {
		extensions : [ '', '.js', '.json', '.coffee' ],
		modulesDirectories : [ 'node_modules', 'libs', 'js/TravelPlannerApp' ],
	},
	plugins : [
			new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", [ "main" ])),
			new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
			new webpack.optimize.DedupePlugin()
			]
};