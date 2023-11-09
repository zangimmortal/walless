import { modules } from '@walless/ioc';
import type { PublicKeyDocument, TokenDocument } from '@walless/store';
import { addTokensToStorage, selectors } from '@walless/store';

import { getTokenQuotes, makeHashId } from '../../utils/api';

import type { TezosRunner } from './shared';
import { KNOWN_TEZOS_MAINNET_TOKENS } from './shared';
import { getNativeTokenDocument, getTokenDocument } from './token';

export const tezosEngineRunner: TezosRunner = {
	start: async (context) => {
		const { storage } = modules;
		const key = await storage.find<PublicKeyDocument>(
			selectors.tezosKeys as never,
		);
		const docPromises: Promise<TokenDocument>[] = [];

		for (const item of key.docs) {
			docPromises.push(getNativeTokenDocument(context, item._id));
			for (const token of KNOWN_TEZOS_MAINNET_TOKENS) {
				docPromises.push(getTokenDocument(context, token, item._id));
			}
		}

		const tokenDocs = await Promise.all(docPromises);
		const quotes = await getTokenQuotes(tokenDocs);

		for (const item of tokenDocs) {
			item.account.quotes = quotes[makeHashId(item)].quotes;
		}

		addTokensToStorage(tokenDocs);
	},
	stop: async () => {
		console.log('stop!');
	},
};

export * from './shared';
