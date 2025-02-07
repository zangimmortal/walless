import { GraphQLClient } from 'graphql-request';

import { fireCache } from './firebase';

export const qlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	errorPolicy: 'all',
	headers: () => {
		const headers: Record<string, string> = {};

		if (fireCache.idToken) {
			headers['Authorization'] = `Bearer ${fireCache.idToken}`;
		}

		return headers;
	},
});
