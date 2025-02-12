import type { FC } from 'react';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import type {
	Collectible,
	Networks,
	Token,
	TransactionPayload,
} from '@walless/core';
import { logger } from '@walless/core';
import type { SliderHandle } from '@walless/gui';
import { View } from '@walless/gui';
import { ResponseCode } from '@walless/messaging';
import type { CollectibleDocument } from '@walless/store';
import { useSnapshot } from 'valtio';

import {
	floatActions,
	injectedElements,
	transactionActions,
	transactionContext,
} from '../../../state';
import { NavButton } from '../components';

import { BigNFT } from './components/BigNFT';
import { RecipientInfo } from './components/RecipientInfo';
import { SenderInfo } from './components/SenderInfo';
import { BigToken, Header } from './components';

interface Props {
	navigator: SliderHandle;
}

const TransactionConfirmation: FC<Props> = ({ navigator }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { createAndSendTransaction, handleSendNftSuccess } =
		useSnapshot(injectedElements);
	const { type, sender, receiver, amount, token, nftCollectible, tokenForFee } =
		useSnapshot(transactionContext);

	const handleContinue = async () => {
		setIsLoading(true);

		if (
			(type === 'Token' && !token) ||
			(type === 'Collectible' && !nftCollectible)
		)
			return floatActions.showError('Invalid token to transfer');

		const payload: TransactionPayload = {
			sender: sender,
			receiver: receiver,
			tokenForFee: tokenForFee as Token,
		} as unknown as TransactionPayload;

		switch (type) {
			case 'Token': {
				payload.amount = parseFloat(amount as string);
				payload.token = token as Token;
				payload.network = token?.network as Networks;
				payload.tokenForFee = tokenForFee as Token;
				break;
			}
			case 'Collectible': {
				payload.amount = 1;
				payload.token = nftCollectible as Collectible;
				payload.network = nftCollectible?.network as Networks;
				payload.tokenForFee = tokenForFee as Token;
				break;
			}
		}

		const res = await createAndSendTransaction(payload);

		try {
			if (res.responseCode == ResponseCode.REQUIRE_PASSCODE) {
				navigator.slideNext();
			} else if (res.responseCode == ResponseCode.SUCCESS) {
				if (nftCollectible && handleSendNftSuccess)
					handleSendNftSuccess(nftCollectible as CollectibleDocument);

				transactionActions.setSignatureString(
					res.signatureString || res.signedTransaction?.digest || res.hash,
				);
				navigator.slideTo(3);
			} else {
				floatActions.showError('Something was wrong');
			}
		} catch (error) {
			logger.error('Failure during NFT send:', error);
			throw error;
		}

		setIsLoading(false);
	};

	return (
		<View style={styles.container}>
			<Header onBack={() => navigator.slideBack()} />

			{type === 'Token' ? <BigToken /> : <BigNFT />}

			<SenderInfo />

			<RecipientInfo />

			{isLoading ? (
				<ActivityIndicator size={'large'} />
			) : (
				<NavButton title="Confirm" onPress={handleContinue} />
			)}
		</View>
	);
};

export default TransactionConfirmation;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 14,
	},
});
