import { type ReactNode, forwardRef, useMemo, useRef } from 'react';
import {
	type MouseEvent,
	type StyleProp,
	type ViewStyle,
	View,
} from 'react-native';
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

import { injectedFontStyle } from '../utils/font';
import { DynamicFlags, iStyles } from '../utils/style';

import { AnimatedPressable } from './aliased';

interface MouseContext {
	mouseIn?: boolean;
}

type Props = Omit<DynamicFlags, 'cursorPointer'> & {
	style?: StyleProp<ViewStyle>;
	children?: ReactNode;
	onHoverIn?: (event: MouseEvent) => void;
	onHoverOut?: (event: MouseEvent) => void;
	hoverOpacity?: number;
	animationDuration?: number;
	onPress?: () => void;
};

export const Hoverable = forwardRef<View, Props>(
	(
		{
			style,
			children,
			hoverOpacity = 0.8,
			onHoverIn,
			onHoverOut,
			animationDuration = 50,
			onPress,
			fullscreen,
			horizontal,
			noSelect = true,
		},
		ref,
	) => {
		const dynamicStyle = injectedFontStyle(style);
		const mouseContextRef = useRef<MouseContext>({});
		const opacity = useSharedValue(1);
		const animatedStyle = useAnimatedStyle(
			() => ({
				opacity: opacity.value,
			}),
			[opacity],
		);
		const containerStyle = useMemo(() => {
			return [
				animatedStyle,
				horizontal && iStyles.horizontal,
				fullscreen && iStyles.fullScreen,
				noSelect && iStyles.noSelect,
				style,
			];
		}, [style, horizontal, fullscreen, noSelect]);

		const handleHoverIn = (event: MouseEvent) => {
			opacity.value = withTiming(hoverOpacity, { duration: animationDuration });
			mouseContextRef.current.mouseIn = true;
			onHoverIn?.(event);
		};

		const handleHoverOut = (event: MouseEvent) => {
			opacity.value = withTiming(1, { duration: animationDuration });
			mouseContextRef.current.mouseIn = false;
			onHoverOut?.(event);
		};

		const handlePressIn = () => {
			opacity.value = hoverOpacity - 0.2;
		};

		const handlePressOut = () => {
			opacity.value = mouseContextRef.current.mouseIn ? hoverOpacity : 1;
		};

		return (
			<AnimatedPressable
				ref={ref}
				style={[containerStyle, dynamicStyle]}
				onHoverIn={handleHoverIn}
				onHoverOut={handleHoverOut}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={onPress}
			>
				{children}
			</AnimatedPressable>
		);
	},
);

Hoverable.displayName = 'Hoverable';

export default Hoverable;
