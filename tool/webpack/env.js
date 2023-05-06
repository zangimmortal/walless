const setEnvironments =
	(variables = {}) =>
	(config, internal) => {
		const { webpack } = internal.modules;
		const { DefinePlugin } = webpack;
		const env = internal.configs.env();
		const isProduction = internal.configs.isProduction(env);
		const environments = [
			'GOOGLE_CLIENT_ID',
			'FIREBASE_API_KEY',
			'FIREBASE_AUTH_DOMAIN',
			'FIREBASE_PROJECT_ID',
			'FIREBASE_STORAGE_BUCKET',
			'FIREBASE_MESSAGING_SENDER_ID',
			'FIREBASE_APP_ID',
			'FIREBASE_MEASUREMENT_ID',
		].reduce((a, i) => {
			a[i] = JSON.stringify(process.env[i]);
			return a;
		}, {});

		config.plugins[0] = new DefinePlugin({
			__DEV__: !isProduction,
			ENV: JSON.stringify(env),
			...environments,
			...variables,
		});

		return config;
	};

module.exports = {
	setEnvironments,
};
