import type { FC } from 'react';
import type { ViewStyle } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import {
	FullHistoryFeature,
	tabBarHeight,
	useSafeAreaInsets,
} from '@walless/app';
import { View } from '@walless/gui';
import { type HomeParamList } from 'utils/navigation';

type Props = StackScreenProps<HomeParamList, 'History'>;

export const HistoryScreen: FC<Props> = () => {
	const insets = useSafeAreaInsets();
	const containerStyle: ViewStyle = {
		paddingBottom: tabBarHeight + insets.bottom,
		paddingHorizontal: 8,
	};

	return (
		<View style={containerStyle}>
			<FullHistoryFeature />
		</View>
	);
};

export default HistoryScreen;
