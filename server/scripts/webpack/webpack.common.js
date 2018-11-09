const path = require('path');

module.exports = {
	target: 'node',
	node: {
		__filename: true,
		__dirname: true,
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				use: [{
					loader: 'babel-loader',
				}],
				exclude: /node_modules/,
			},
			{
				test: /\.graphql?$/,
				exclude: /node_modules/,
				use: {
					loader: 'raw-loader',
				},
			},
		],
	},
	output: {
		path: path.join(__dirname, '..', '..', 'dist'),
		filename: 'server.js',
	},
};
