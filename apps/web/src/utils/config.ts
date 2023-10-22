import type { UniversalAsset } from '@walless/ioc';

export const webAsset: UniversalAsset = {
	widget: {
		solana: {
			cardIcon: { uri: '/img/widget/solana-icon.png' },
			cardMark: { uri: '/img/widget/solana-mark.png' },
			cardBackground: { uri: '/img/widget/sky-card-bg.png' },
		},
		sui: {
			cardIcon: { uri: '/img/widget/sui-icon.png' },
			cardMark: { uri: '/img/widget/sui-mark.png' },
			cardBackground: { uri: '/img/widget/sky-card-bg.png' },
		},
		tezos: {
			cardIcon: { uri: '/img/widget/tezos-icon.png' },
			cardBackground: { uri: '/img/widget/tezos-card-bg.png' },
		},
		ethereum: {
			cardIcon: { uri: '' },
			cardMark: { uri: '' },
			cardBackground: { uri: '' },
		},
	},
};

export const resources = {
	walless: {
		icon: {
			uri: '/img/icon.png',
		},
	},
	common: {
		question: {
			uri: '/img/question.png',
		},
	},
};

export const w3aBaseUrl = __DEV__ ? location.origin : 'https:app.walless.io';
