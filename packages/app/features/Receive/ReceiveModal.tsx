import type { FC } from 'react';
import { StyleSheet } from 'react-native';
import type { Networks } from '@walless/core';
import { runtime } from '@walless/core';
import { keyState } from '@walless/engine';
import type { ModalConfigs } from '@walless/gui';
import { modalActions, SwipeDownGesture } from '@walless/gui';
import { useSnapshot } from 'valtio';

import ModalHeader from '../../components/ModalHeader';
import ModalWrapper from '../../components/ModalWrapper';
import { getNetworkInfo } from '../../utils';

import Slider, {
	type IndicatorOption,
	type SlideOption,
} from './components/Slider';
import WalletCard, { type WalletProps } from './components/WalletCard';
import WalletCardIndicator from './components/WalletCardIndicator';

const ReceiveModal: FC<{ config: ModalConfigs }> = ({ config }) => {
	const keyMap = useSnapshot(keyState);

	const walletList: WalletProps[] = [];
	Object.values(keyMap).forEach((keyMap) => {
		keyMap.forEach((key) => {
			const networkInfo = getNetworkInfo(key.network);
			walletList.push({
				network: key.network.charAt(0).toUpperCase() + key.network.slice(1),
				networkIcon: networkInfo?.icon ?? { uri: '/img/...' },
				address: key._id,
			});
		});
	});

	let items: SlideOption[];

	const { network } = config.context as { network: Networks };

	if (network) {
		items = walletList
			.filter((wallet) => wallet.network.toLowerCase() === network)
			.map((wallet, index) => ({
				id: `${index}`,
				component: WalletCard,
				context: wallet,
			}));
	} else {
		items = walletList.map((wallet, index) => ({
			id: `${index}`,
			component: WalletCard,
			context: wallet,
		}));
	}

	const indicator: IndicatorOption = {
		id: 'indicator',
		component: WalletCardIndicator,
		context: { count: items.length },
	};

	const handleClose = () => {
		modalActions.hide(config?.id as string);
	};

	return (
		<SwipeDownGesture
			callbackOnClose={handleClose}
			gestureEnable={runtime.isMobile}
		>
			<ModalWrapper>
				<ModalHeader content="Receive" onPressClose={handleClose} />
				<Slider
					style={styles.sliderContainer}
					items={items}
					indicator={indicator}
				/>
			</ModalWrapper>
		</SwipeDownGesture>
	);
};

export default ReceiveModal;

const styles = StyleSheet.create({
	sliderContainer: {
		gap: 22,
		overflow: 'hidden',
	},
});
