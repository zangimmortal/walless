import { modules } from '@walless/ioc';
import type { PublicKeyDocument, TokenDocument } from '@walless/store';
import { selectors } from '@walless/store';

import { tokenActions } from '../../state/token';
import { getTokenQuotes, makeHashId } from '../../utils/api';

import type { SuiRunner } from './shared';
import { suiTokenSubscribe, suiTokenUnsubscribe } from './subscription';
import { getTokenDocument } from './token';

export const suiEngineRunner: SuiRunner = {
	start: async (context) => {
		const { storage } = modules;
		const { connection } = context;
		const key = await storage.find<PublicKeyDocument>(selectors.suiKeys);

		for (const item of key.docs) {
			const owner = item._id;
			const allCoinsBalance = await connection.getAllBalances({ owner });
			const docPromises: Promise<TokenDocument>[] = new Array(
				allCoinsBalance.length,
			);

			for (let i = 0; i < allCoinsBalance.length; i += 1) {
				const coin = allCoinsBalance[i];

				docPromises[i] = getTokenDocument(context, owner, coin);
			}

			const tokenDocs = await Promise.all(docPromises);
			const quotes = await getTokenQuotes(tokenDocs);

			for (const item of tokenDocs) {
				item.account.quotes = quotes[makeHashId(item)].quotes;
			}

			tokenActions.setItems(tokenDocs);

			suiTokenSubscribe(connection, owner);
		}
	},
	stop: async () => {
		console.log('stop!');
		suiTokenUnsubscribe();
	},
};

export * from './shared';
