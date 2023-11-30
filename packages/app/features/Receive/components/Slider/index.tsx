import type { FC } from 'react';
import { useState } from 'react';
import type { ViewStyle } from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { AnimatedView, View } from '@walless/gui';

import type { IndicatorOption, SlideOption } from './shared';

interface Props {
	style?: ViewStyle;
	items: SlideOption[];
	onItemSelect?: (item: SlideOption) => void;
	indicator?: IndicatorOption;
}

export const Slider: FC<Props> = ({ style, items, indicator }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const offset = useSharedValue(0);
	const context = useSharedValue(0);
	const [childWidth, setChildWidth] = useState(0);

	const animatedStyle = useAnimatedStyle(
		() => ({
			flexDirection: 'row',
			transform: [{ translateX: offset.value }],
		}),
		[offset],
	);

	const handleItemSelect = (index: number) => {
		offset.value = withTiming(-childWidth * index, {});
		setActiveIndex(index);
	};

	const Indicator = indicator?.component || (() => null);

	const leftLimit = 0;
	const rightLimit = -childWidth * (items.length - 1);

	const pan = Gesture.Pan()
		.onStart(() => {
			context.value = offset.value;
		})
		.onUpdate((event) => {
			const newPosition = event.translationX + context.value;
			const limitReach = newPosition > leftLimit || newPosition < rightLimit;
			if (!limitReach) {
				offset.value = newPosition;
			}
		})
		.onEnd(() => {
			const index = Math.round(-(offset.value / childWidth));
			offset.value = withTiming(-childWidth * index);
			runOnJS(setActiveIndex)(index);
		});

	return (
		<View
			style={style}
			onLayout={({ nativeEvent }) => {
				setChildWidth(nativeEvent.layout.width);
			}}
		>
			{childWidth > 0 && (
				<>
					<GestureHandlerRootView>
						<GestureDetector gesture={pan}>
							<AnimatedView style={animatedStyle}>
								{items.map((item) => {
									const { id, component: InnerComponent } = item;

									return (
										<View style={{ width: childWidth }} key={id}>
											<InnerComponent config={item} />
										</View>
									);
								})}
							</AnimatedView>
						</GestureDetector>
					</GestureHandlerRootView>

					<View>
						{indicator && (
							<Indicator
								config={{
									component: Indicator,
									context: indicator.context,
									currentActiveIndex: activeIndex,
									setCurrentActiveIndex: handleItemSelect,
								}}
							/>
						)}
					</View>
				</>
			)}
		</View>
	);
};

export default Slider;

export * from './shared';
