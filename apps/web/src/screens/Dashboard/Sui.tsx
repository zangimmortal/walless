import type { FC } from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import type { CardSkin, TabAble } from '@walless/app';
import {
	MainFeatures,
	SlideHandler,
	TabsHeader,
	WalletCard,
} from '@walless/app';
import { Networks } from '@walless/core';
import type { SlideOption } from '@walless/gui';
import { Slider } from '@walless/gui';
import { Copy } from '@walless/icons';
import { Stack } from '@walless/ui';
import { appActions } from 'state/app';
import { showReceiveModal } from 'state/app/modal';
import { onrampWithGateFi } from 'utils/gatefi';
import { usePublicKeys, useSettings, useTokens } from 'utils/hooks';

import EmptyTab from './components/EmptyTab';
import TokenTab from './components/TokenTab';
import { layoutTabs } from './shared';

interface Props {
	variant?: string;
}

export const SuiDashboard: FC<Props> = () => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const { setting, setPrivacy } = useSettings();
	const { tokens } = useTokens(Networks.sui);
	const publicKeys = usePublicKeys(Networks.sui);
	const bottomSliderItems: SlideOption[] = [
		{
			id: 'tokens',
			component: () => <TokenTab tokens={tokens} />,
		},
		{
			id: 'collectibles',
			component: EmptyTab,
		},
		{
			id: 'activities',
			component: EmptyTab,
		},
	];

	const handleTabPress = (item: TabAble) => {
		const idx = layoutTabs.indexOf(item);
		setActiveTabIndex(idx);
	};

	const handleCopyAddress = async (value: string) => {
		await appActions.copy(value, () => <Copy size={18} color="#FFFFFF" />);
	};

	const handleSend = () => {
		appActions.showSendModal({ layoutNetwork: Networks.sui });
	};

	const handleBuy = () => {
		onrampWithGateFi({
			wallet: publicKeys[0]._id,
		});
	};

	const handleChangePrivateSetting = (next: boolean) => {
		setPrivacy(next);
	};

	return (
		<Stack flex={1} padding={12} gap={18}>
			<Stack horizontal gap={12}>
				{publicKeys.map((item, index) => {
					return (
						<WalletCard
							key={index}
							index={index}
							item={item}
							skin={suiCardSkin}
							hideBalance={setting.hideBalance}
							onCopyAddress={handleCopyAddress}
							onChangePrivateSetting={handleChangePrivateSetting}
							width={publicKeys.length == 1 ? 328 : 312}
						/>
					);
				})}
			</Stack>
			<Stack alignItems="center" gap={18}>
				<MainFeatures
					onReceivePress={() => showReceiveModal(Networks.sui)}
					onSendPress={handleSend}
					onBuyPress={handleBuy}
				/>
				{publicKeys.length > 1 && (
					<SlideHandler items={publicKeys} activeItem={publicKeys[0]} />
				)}
			</Stack>
			<Stack flex={1}>
				<TabsHeader
					items={layoutTabs}
					activeItem={layoutTabs[activeTabIndex]}
					onTabPress={handleTabPress}
				/>
				<Slider
					style={styles.sliderContainer}
					items={bottomSliderItems}
					activeItem={bottomSliderItems[activeTabIndex]}
				/>
			</Stack>
		</Stack>
	);
};

export default SuiDashboard;

const suiCardSkin: CardSkin = {
	backgroundSrc: { uri: '/img/network/sky-card-bg.png' },
	largeIconSrc: { uri: '/img/network/sui-icon-lg.png' },
	iconSrc: { uri: '/img/network/sui-icon-sm.png' },
	iconColor: '#FFFFFF',
	iconSize: 12,
};

const styles = StyleSheet.create({
	sliderContainer: {
		flex: 1,
	},
});
