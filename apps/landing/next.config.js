const withPlugins = require('next-compose-plugins');
const { withTamagui } = require('@tamagui/next-plugin');
const project = require('../web/package.json');

module.exports = withPlugins(
	[
		withTamagui({
			config: './tamagui.config.js',
			components: ['@tamagui/core'],
			useReactNativeWebLite: true,
			disableExtraction: process.env.NODE_ENV !== 'production',
			excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker'],
		}),
		{
			transpilePackages: ['@walless/ui', '@walless/icons', '@walless/markdown'],
		},
	],
	{
		swcMinify: true,
		reactStrictMode: true,
		optimizeFonts: true,
		experimental: {
			esmExternals: true,
			forceSwcTransforms: true,
			scrollRestoration: true,
			legacyBrowsers: false,
		},
		env: {
			EXTENSION_VERSION: project.version,
		},
		webpack: (config) => {
			config.module.rules.push({
				test: /\.md$/i,
				type: 'asset/source',
			});

			return config;
		},
	},
);
