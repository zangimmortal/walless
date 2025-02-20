import type { FC } from 'react';
import { useMemo, useState } from 'react';
import type {
	LayoutChangeEvent,
	LayoutRectangle,
	ViewStyle,
} from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Networks } from '@walless/core';
import type { SlideOption } from '@walless/gui';
import { Slider } from '@walless/gui';
import { utils } from '@walless/ioc';

import MainFeatureButtons from '../../components/MainFeatureButtons';
import type { TabAble } from '../../components/TabsHeader';
import TabsHeader from '../../components/TabsHeader';
import WalletCard from '../../components/WalletCard';
import { floatActions } from '../../state';
import { copy } from '../../utils';
import { useNfts, useOpacityAnimated } from '../../utils/hooks';
import { usePublicKeys, useTokens } from '../../utils/hooks';
import { showReceiveModal } from '../Receive';

import ActivityTab from './components/ActivityTab';
import AptosTokensTab from './components/AptosTokensTab';
import { CollectiblesTab, TokenTab } from './components';
import { getWalletCardSkin, layoutTabs } from './shared';

interface Props {
	id: string;
}

export const BuiltInNetwork: FC<Props> = ({ id }) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const keys = usePublicKeys(id as Networks);
	const [headerLayout, setHeaderLayout] = useState<LayoutRectangle>();
	const { tokens, valuation } = useTokens(id as Networks);
	const { collections } = useNfts(id as Networks);
	const cardSkin = useMemo(() => getWalletCardSkin(id as never), [id]);
	const opacityAnimated = useOpacityAnimated({ from: 0, to: 1 });

	const container: ViewStyle = {
		...styles.container,
	};

	const bottomSliderItems: SlideOption[] = [
		{
			id: 'tokens',
			component: () => <TokenTab tokens={tokens} />,
		},
		{
			id: 'collectibles',
			component: () =>
				id === Networks.aptos ? (
					<AptosTokensTab pubkey={keys[0]._id} />
				) : (
					<CollectiblesTab collections={collections} />
				),
		},
		{
			id: 'activities',
			component: () => <ActivityTab network={id as Networks} />,
		},
	];

	const handleTabPress = (item: TabAble) => {
		const idx = layoutTabs.indexOf(item);
		setActiveTabIndex(idx);
	};

	const onHeaderLayout = ({ nativeEvent }: LayoutChangeEvent) => {
		setHeaderLayout(nativeEvent.layout);
	};

	const handlePressSend = () => {
		floatActions.showSendTokenModal({
			layoutNetwork: id as Networks,
		});
	};

	const handlePressReceive = () => {
		showReceiveModal(id as Networks);
	};

	const handlePressBuy = () => {
		if (utils.buyToken) utils.buyToken(id as Networks);
	};

	return (
		<Animated.View style={[container, opacityAnimated.style]}>
			<View style={styles.headerContainer} onLayout={onHeaderLayout}>
				{headerLayout?.width &&
					keys.map((item, index) => {
						return (
							<WalletCard
								key={index}
								index={index}
								item={item}
								valuation={valuation}
								skin={cardSkin}
								hideBalance={false}
								width={headerLayout.width}
								onCopyAddress={copy}
							/>
						);
					})}

				<MainFeatureButtons
					onSendPress={handlePressSend}
					onReceivePress={handlePressReceive}
					onBuyPress={id === Networks.solana ? handlePressBuy : undefined}
				/>
			</View>

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
		</Animated.View>
	);
};

export default BuiltInNetwork;

const headingSpacing = 18;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 12,
		paddingHorizontal: 18,
	},
	headerContainer: {
		alignItems: 'center',
		gap: headingSpacing,
		paddingBottom: headingSpacing,
	},
	sliderContainer: {
		flex: 1,
		overflow: 'hidden',
	},
});
