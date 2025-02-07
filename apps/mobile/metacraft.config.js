const { web3Polyfills } = require('@metacraft/cli-web3-polyfills');
const {
	swcOptions,
	copyAssets,
	w3aDevRoute,
	registerExtFile,
	injectEntries,
	injectEnvironments,
} = require('./browser/bundler/webpack');

module.exports = {
	publicPath: () => process.env.PUBLIC_URL || '/',
	keepPreviousBuild: () => true,
	buildId: () => 'app',
	swcOptions,
	webpackMiddlewares: [
		copyAssets,
		web3Polyfills,
		registerExtFile,
		injectEntries,
		injectEnvironments,
	],
	devMiddlewares: [w3aDevRoute],
	htmlPluginOptions: {
		chunks: ['app'],
	},
	moduleAlias: {
		global: {
			'react-native$': 'react-native-web',
			'react-native-keychain': 'vendor/web-keychain',
			'react-native-haptic-feedback': 'vendor/web-haptic',
		},
	},
};
