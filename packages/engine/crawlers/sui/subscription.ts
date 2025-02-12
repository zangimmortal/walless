import type { JsonRpcProvider } from '@mysten/sui.js';
import { logger } from '@walless/core';
import {
	addCollectibleToStorage,
	updateTokenBalanceToStorage,
} from '@walless/store';

import { getSuiCollectibles } from './collectibles';

const suiSubscriptionPool: NodeJS.Timer[] = [];

export const suiTokenSubscribe = (
	connection: JsonRpcProvider,
	owner: string,
) => {
	suiSubscriptionPool.push(
		setInterval(async () => {
			try {
				const coinsBalance = await connection.getAllBalances({ owner });

				coinsBalance.forEach((coin) => {
					updateTokenBalanceToStorage(
						`${owner}/token/${coin.coinType}`,
						coin.totalBalance,
					);
				});
			} catch (e) {
				logger.error('Sui token live watch error', e);
			}
		}, 5000),
	);
};

export const suiCollectibleSubscribe = async (
	connection: JsonRpcProvider,
	owner: string,
) => {
	suiSubscriptionPool.push(
		setInterval(async () => {
			try {
				const collectibleDocs = await getSuiCollectibles(connection, owner);

				collectibleDocs.forEach((collectible) =>
					addCollectibleToStorage(collectible._id, collectible),
				);
			} catch (e) {
				logger.error('Sui collectible live watch error', e);
			}
		}, 30000),
	);
};

export const suiTokenUnsubscribe = () => {
	suiSubscriptionPool.forEach((subscription) => clearInterval(subscription));
};
