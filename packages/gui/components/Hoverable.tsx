import { type ReactNode, forwardRef, useRef } from 'react';
import { type MouseEvent, type ViewStyle, View } from 'react-native';
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from './aliased';

interface MouseContext {
	mouseIn?: boolean;
}

interface Props {
	style?: ViewStyle;
	children?: ReactNode;
	onHoverIn?: (event: MouseEvent) => void;
	onHoverOut?: (event: MouseEvent) => void;
	hoverOpacity?: number;
	animationDuration?: number;
	onPress?: () => void;
}

export const Hoverable = forwardRef<View, Props>(
	(
		{
			style,
			children,
			hoverOpacity = 0.6,
			onHoverIn,
			onHoverOut,
			animationDuration = 50,
			onPress,
		},
		ref,
	) => {
		const mouseContextRef = useRef<MouseContext>({});
		const opacity = useSharedValue(1);
		const containerStyle = useAnimatedStyle(
			() => ({
				opacity: opacity.value,
			}),
			[opacity],
		);

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
			opacity.value = withTiming(0.4, { duration: animationDuration });
		};

		const handlePressOut = () => {
			const nextOpacity = mouseContextRef.current.mouseIn ? hoverOpacity : 1;
			opacity.value = withTiming(nextOpacity, { duration: animationDuration });
		};

		return (
			<AnimatedPressable
				ref={ref}
				style={[containerStyle, style]}
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
