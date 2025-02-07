import { Networks } from '@walless/core';
import type { TokenDocument } from '@walless/store';
import type { HexString, Provider } from 'aptos';
import { APTOS_COIN } from 'aptos';

export const getCoins = async (provider: Provider, pubkey: HexString) => {
	const coinsData = await provider.getAccountCoinsData(pubkey);

	const tokenDocuments: TokenDocument[] = [];

	coinsData.current_fungible_asset_balances.forEach((coin) => {
		tokenDocuments.push({
			_id: coin.asset_type,
			account: {
				balance: coin.amount,
				decimals: coin.metadata?.decimals ?? 0,
				owner: pubkey.toString(),
				address: coin.asset_type,
			},
			network: Networks.aptos,
			type: 'Token',
			metadata: {
				name: coin.metadata?.name ?? 'Unknown',
				symbol: coin.metadata?.symbol ?? 'Unknown',
				imageUri: coin.metadata?.icon_uri ?? '',
			},
		});
	});

	const aptosCoinIdx = tokenDocuments.findIndex(
		(token) => token._id === APTOS_COIN,
	);
	tokenDocuments[aptosCoinIdx].metadata = {
		...tokenDocuments[aptosCoinIdx].metadata,
		imageUri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
	};
	tokenDocuments.unshift(tokenDocuments.splice(aptosCoinIdx, 1)[0]);

	return tokenDocuments;
};
