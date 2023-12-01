import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from '@walless/app';
import { SettingFeature } from '@walless/app';
import { tabBarHeight } from 'stacks/Dashboard/TabBar';

export const SettingScreen = () => {
	const insets = useSafeAreaInsets();
	const scrollContainerStyle: ViewStyle = {
		paddingBottom: tabBarHeight + insets.bottom,
	};

	return <SettingFeature scrollContentContainerStyle={scrollContainerStyle} />;
};

export default SettingScreen;
