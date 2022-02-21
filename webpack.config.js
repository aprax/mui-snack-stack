const path = require("path");

module.exports = {
	mode: "development",
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
					},
				],
			},
		],
	},
	entry: "./src/index.tsx",
	output: {
		filename: "index.js",
		library: {
			name: 'MuiSnackStack',
			type: 'umd'
		}
	},
	resolve: {
		extensions: [".ts", ".tsx", '.js'],
	},
	externals: {
		'react': 'react',
		'react-dom': 'react-dom',
		"@mui/material": {
			amd: "@mui/material",
			commonjs: '@mui/material',
			commonjs2: '@mui/material'
		},
		"@mui/icons-material": {
			amd: "@mui/icons-material",
			commonjs: "@mui/icons-material",
			commonjs2: '@mui/material'
		},
		"@emotion/react": {
			amd: "@emotion/react",
			commonjs: "@emotion/react",
			commonjs2: '@mui/material'
		},
		"@emotion/styled": {
			amd: "@emotion/styled",
			commonjs: "@emotion/styled",
			commonjs2: "@emotion/styled"
		},
	}
};
