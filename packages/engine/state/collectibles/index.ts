import {
	type CollectibleDocument,
	type CollectionDocument,
} from '@walless/store';

import { collectiblesState, collectionsState } from './internal';

export const collectibleActions = {
	setCollectibles: (items: CollectibleDocument[]) => {
		for (const item of items) {
			collectiblesState.map.set(item._id, item);
		}
	},
	setCollections: (items: CollectionDocument[]) => {
		for (const item of items) {
			collectionsState.map.set(item._id, item);
		}
	},
	updateCollectible: (owner: string, mint: string) => {
		const id = `${owner}/${mint}`;

		const collectible = collectiblesState.map.get(id);
		if (collectible) {
			// TODO: Update collectible
		}
	},
};

export * from './internal';
