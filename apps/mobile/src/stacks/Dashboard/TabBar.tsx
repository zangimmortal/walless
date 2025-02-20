import type { FC } from 'react';
import { useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import { tabBarHeight, useSnapshot } from '@walless/app';
import { AnimatedView } from '@walless/gui';
import type { IconProps } from '@walless/icons';
import { Home, Walless } from '@walless/icons';
import { HapticFeedbackTypes, modules } from '@walless/ioc';
import { localState } from 'state/local';
import type { DashboardParamList } from 'utils/navigation';

import { ProfileIcon } from './ProfileIcon';
import TabBarItem from './TabBarItem';

const timingConfig: WithTimingConfig = {
	duration: 150,
	easing: Easing.linear,
};

interface Props {
	tabProps: BottomTabBarProps;
}

export const BottomNavigationTabBar: FC<Props> = ({ tabProps }) => {
	const { insets, state, navigation } = tabProps;
	const { isDrawerOpen } = useSnapshot(localState);
	const offset = useSharedValue(0);
	const realBarHeight = tabBarHeight + insets.bottom;
	const animatedStyles = useAnimatedStyle(
		() => ({
			transform: [{ translateY: offset.value }],
		}),
		[offset],
	);

	useEffect(() => {
		const { routes, index } = state;
		const currentRoute = routes[index];
		const widgetId = currentRoute.params?.params?.id;
		const isExploreTab = currentRoute.name === 'Explore' && !widgetId;

		const nextOffset = isDrawerOpen || isExploreTab ? 0 : realBarHeight;
		offset.value = withTiming(nextOffset, timingConfig);
	}, [isDrawerOpen]);

	const containerStyle: ViewStyle = {
		height: realBarHeight,
		paddingBottom: insets.bottom,
	};

	const handleNavigate = (route: RouteProp<DashboardParamList>) => {
		const currentRoute = state.routes[state.index];
		const isFocusing = currentRoute.key === route.key;

		const event = navigation.emit({
			type: 'tabPress',
			target: route.key,
			canPreventDefault: true,
		});

		if (!isFocusing && !event.defaultPrevented) {
			modules.native.triggerHaptic(HapticFeedbackTypes.impactHeavy);
			navigation.navigate({
				name: route.name,
				merge: true,
			} as never);
		}
	};

	return (
		<AnimatedView style={[styles.container, containerStyle, animatedStyles]}>
			{state.routes.map((route, index) => {
				const isActive = state.index === index;
				const itemProps = iconPropsFromRouteMap[route.name];

				return (
					<TabBarItem
						key={route.key}
						isActive={isActive}
						onPress={handleNavigate}
						route={route as never}
						{...itemProps}
					/>
				);
			})}
		</AnimatedView>
	);
};

export default BottomNavigationTabBar;

interface IconMapProps {
	icon: FC<IconProps>;
	size: number;
}

const iconPropsFromRouteMap: Record<string, IconMapProps> = {
	Explore: {
		icon: Walless,
		size: 20,
	},
	Home: {
		icon: Home,
		size: 20,
	},
	Setting: {
		icon: ProfileIcon,
		size: 20,
	},
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		height: tabBarHeight,
		paddingVertical: 4,
		backgroundColor: '#081016',
	},
	itemContainer: {
		padding: 8,
	},
});
