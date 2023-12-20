import { useCallback, useEffect, useRef } from 'react';
import {
	I18nManager,
	InteractionManager,
	Keyboard,
	Platform,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
	PanGestureHandler,
	State as GestureState,
} from 'react-native-gesture-handler';
import Animated, {
	interpolate,
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import type { DrawerProps } from '../types';
import DrawerProgressContext from '../utils/DrawerProgressContext';

import Overlay from './Overlay';

const SWIPE_DISTANCE_MINIMUM = 5;
const DEFAULT_DRAWER_WIDTH = '80%';

type ToggleOptions = {
	open: boolean;
	isUserInitiated: boolean;
	velocity?: number;
};

const minmax = (value: number, start: number, end: number) => {
	'worklet';

	return Math.min(Math.max(value, start), end);
};

export default function Drawer({
	dimensions,
	drawerPosition,
	drawerStyle,
	drawerType,
	gestureHandlerProps,
	hideStatusBarOnOpen,
	keyboardDismissMode,
	onClose,
	onOpen,
	open,
	overlayStyle,
	renderDrawerContent,
	renderSceneContent,
	statusBarAnimation,
	swipeDistanceThreshold,
	swipeEdgeWidth,
	swipeEnabled,
	swipeVelocityThreshold,
	overlayAccessibilityLabel,
}: DrawerProps) {
	const getDrawerWidth = (): number => {
		const { width = DEFAULT_DRAWER_WIDTH } =
			StyleSheet.flatten(drawerStyle) || {};

		if (typeof width === 'string' && width.endsWith('%')) {
			// Try to calculate width if a percentage is given
			const percentage = Number(width.replace(/%$/, ''));

			if (Number.isFinite(percentage)) {
				return dimensions.width * (percentage / 100);
			}
		}

		return typeof width === 'number' ? width : 0;
	};

	const drawerWidth = getDrawerWidth();

	const isOpen = drawerType === 'permanent' ? true : open;
	const isRight = drawerPosition === 'right';

	const getDrawerTranslationX = useCallback(
		(open: boolean) => {
			'worklet';

			if (drawerPosition === 'left') {
				return open ? 0 : -drawerWidth;
			}

			return open ? 0 : drawerWidth;
		},
		[drawerPosition, drawerWidth],
	);

	const hideStatusBar = useCallback(
		(hide: boolean) => {
			if (hideStatusBarOnOpen) {
				StatusBar.setHidden(hide, statusBarAnimation);
			}
		},
		[hideStatusBarOnOpen, statusBarAnimation],
	);

	useEffect(() => {
		hideStatusBar(isOpen);

		return () => hideStatusBar(false);
	}, [isOpen, hideStatusBarOnOpen, statusBarAnimation, hideStatusBar]);

	const interactionHandleRef = useRef<number | null>(null);

	const startInteraction = () => {
		interactionHandleRef.current = InteractionManager.createInteractionHandle();
	};

	const endInteraction = () => {
		if (interactionHandleRef.current != null) {
			InteractionManager.clearInteractionHandle(interactionHandleRef.current);
			interactionHandleRef.current = null;
		}
	};

	const hideKeyboard = () => {
		if (keyboardDismissMode === 'on-drag') {
			Keyboard.dismiss();
		}
	};

	const onGestureStart = () => {
		startInteraction();
		hideKeyboard();
		hideStatusBar(true);
	};

	const onGestureFinish = () => {
		endInteraction();
	};

	// FIXME: Currently hitSlop is broken when on Android when drawer is on right
	// https://github.com/software-mansion/react-native-gesture-handler/issues/569
	const hitSlop = isRight
		? // Extend hitSlop to the side of the screen when drawer is closed
			// This lets the user drag the drawer from the side of the screen
			{ right: 0, width: isOpen ? undefined : swipeEdgeWidth }
		: { left: 0, width: isOpen ? undefined : swipeEdgeWidth };

	const touchStartX = useSharedValue(0);
	const touchX = useSharedValue(0);
	const translationX = useSharedValue(getDrawerTranslationX(open));
	const gestureState = useSharedValue<GestureState>(GestureState.UNDETERMINED);

	const toggleDrawer = useCallback(
		({ open, isUserInitiated, velocity }: ToggleOptions) => {
			'worklet';

			const translateX = getDrawerTranslationX(open);

			touchStartX.value = 0;
			touchX.value = 0;
			translationX.value = withSpring(translateX, {
				velocity,
				stiffness: 1000,
				damping: 500,
				mass: 3,
				overshootClamping: true,
				restDisplacementThreshold: 0.01,
				restSpeedThreshold: 0.01,
			});

			if (!isUserInitiated) {
				return;
			}

			if (open) {
				runOnJS(onOpen)();
			} else {
				runOnJS(onClose)();
			}
		},
		[getDrawerTranslationX, onClose, onOpen, touchStartX, touchX, translationX],
	);

	useEffect(
		() => toggleDrawer({ open, isUserInitiated: false }),
		[open, toggleDrawer],
	);

	const onGestureEvent = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		{ startX: number; hasCalledOnStart: boolean }
	>(
		{
			onStart: (event, ctx) => {
				ctx.hasCalledOnStart = false;
				ctx.startX = translationX.value;
				gestureState.value = event.state;
				touchStartX.value = event.x;
			},
			onActive: (event, ctx) => {
				touchX.value = event.x;
				translationX.value = ctx.startX + event.translationX;
				gestureState.value = event.state;

				// onStart will _always_ be called, even when the activation
				// criteria isn't met yet. This makes sure onGestureStart is only
				// called when the criteria is really met.
				if (!ctx.hasCalledOnStart) {
					ctx.hasCalledOnStart = true;
					runOnJS(onGestureStart)();
				}
			},
			onEnd: (event) => {
				gestureState.value = event.state;

				const nextOpen =
					(Math.abs(event.translationX) > SWIPE_DISTANCE_MINIMUM &&
						Math.abs(event.translationX) > swipeVelocityThreshold) ||
					Math.abs(event.translationX) > swipeDistanceThreshold
						? drawerPosition === 'left'
							? // If swiped to right, open the drawer, otherwise close it
								(event.velocityX === 0 ? event.translationX : event.velocityX) >
								0
							: // If swiped to left, open the drawer, otherwise close it
								(event.velocityX === 0 ? event.translationX : event.velocityX) <
								0
						: open;

				toggleDrawer({
					open: nextOpen,
					isUserInitiated: true,
					velocity: event.velocityX,
				});
			},
			onFinish: () => {
				runOnJS(onGestureFinish)();
			},
		},
		// [
		// 	translationX,
		// 	touchStartX,
		// 	touchX,
		// 	gestureState,
		// 	drawerPosition,
		// 	swipeVelocityThreshold,
		// 	swipeDistanceThreshold,
		// 	open,
		// ],
	);

	const translateX = useDerivedValue(() => {
		// Comment stolen from react-native-gesture-handler/DrawerLayout
		//
		// While closing the drawer when user starts gesture outside of its area (in greyed
		// out part of the window), we want the drawer to follow only once finger reaches the
		// edge of the drawer.
		// E.g. on the diagram below drawer is illustrate by X signs and the greyed out area by
		// dots. The touch gesture starts at '*' and moves left, touch path is indicated by
		// an arrow pointing left
		// 1) +---------------+ 2) +---------------+ 3) +---------------+ 4) +---------------+
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    |XXXXXXXX|......|    |XXXXXXXX|.<-*..|    |XXXXXXXX|<--*..|    |XXXXX|<-----*..|
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
		//    +---------------+    +---------------+    +---------------+    +---------------+
		//
		// For the above to work properly we define animated value that will keep start position
		// of the gesture. Then we use that value to calculate how much we need to subtract from
		// the translationX. If the gesture started on the greyed out area we take the distance from the
		// edge of the drawer to the start position. Otherwise we don't subtract at all and the
		// drawer be pulled back as soon as you start the pan.
		//
		// This is used only when drawerType is "front"
		const touchDistance =
			drawerType === 'front' && gestureState.value === GestureState.ACTIVE
				? minmax(
						drawerPosition === 'left'
							? touchStartX.value - drawerWidth
							: dimensions.width - drawerWidth - touchStartX.value,
						0,
						dimensions.width,
					)
				: 0;

		const translateX =
			drawerPosition === 'left'
				? minmax(translationX.value + touchDistance, -drawerWidth, 0)
				: minmax(translationX.value - touchDistance, 0, drawerWidth);

		return translateX;
	}, [
		drawerType,
		drawerPosition,
		drawerWidth,
		dimensions.width,
		translationX,
		touchStartX,
	]);

	const isRTL = I18nManager.getConstants().isRTL;
	const drawerAnimatedStyle = useAnimatedStyle(() => {
		const distanceFromEdge = dimensions.width - drawerWidth;

		return {
			transform:
				drawerType === 'permanent'
					? // Reanimated needs the property to be present, but it results in Browser bug
						// https://bugs.chromium.org/p/chromium/issues/detail?id=20574
						[]
					: [
							{
								translateX:
									// The drawer stays in place when `drawerType` is `back`
									(drawerType === 'back' ? 0 : translateX.value) +
									(drawerPosition === 'left'
										? isRTL
											? -distanceFromEdge
											: 0
										: isRTL
											? 0
											: distanceFromEdge),
							},
						],
		};
	}, [
		drawerType,
		drawerPosition,
		drawerWidth,
		dimensions.width,
		translateX,
		isRTL,
	]);

	const contentAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform:
				drawerType === 'permanent'
					? // Reanimated needs the property to be present, but it results in Browser bug
						// https://bugs.chromium.org/p/chromium/issues/detail?id=20574
						[]
					: [
							{
								translateX:
									// The screen content stays in place when `drawerType` is `front`
									drawerType === 'front'
										? 0
										: translateX.value +
											drawerWidth * (drawerPosition === 'left' ? 1 : -1),
							},
						],
		};
	}, [drawerType, drawerPosition, drawerWidth, translateX]);

	const progress = useDerivedValue(() => {
		return drawerType === 'permanent'
			? 1
			: interpolate(
					translateX.value,
					[getDrawerTranslationX(false), getDrawerTranslationX(true)],
					[0, 1],
				);
	}, [drawerType, translateX]);

	return (
		<DrawerProgressContext.Provider value={progress}>
			<PanGestureHandler
				activeOffsetX={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
				failOffsetY={[-SWIPE_DISTANCE_MINIMUM, SWIPE_DISTANCE_MINIMUM]}
				hitSlop={hitSlop}
				enabled={drawerType !== 'permanent' && swipeEnabled}
				onGestureEvent={onGestureEvent}
				{...gestureHandlerProps}
			>
				{/* Immediate child of gesture handler needs to be an Animated.View */}
				<Animated.View
					style={[
						styles.main,
						{
							flexDirection:
								drawerType === 'permanent' && !isRight ? 'row-reverse' : 'row',
						},
					]}
				>
					<Animated.View style={[styles.content, contentAnimatedStyle]}>
						<View
							accessibilityElementsHidden={isOpen && drawerType !== 'permanent'}
							importantForAccessibility={
								isOpen && drawerType !== 'permanent'
									? 'no-hide-descendants'
									: 'auto'
							}
							style={styles.content}
						>
							{renderSceneContent()}
						</View>
						{drawerType !== 'permanent' ? (
							<Overlay
								progress={progress}
								onPress={() =>
									toggleDrawer({ open: false, isUserInitiated: true })
								}
								style={overlayStyle}
								accessibilityLabel={overlayAccessibilityLabel}
							/>
						) : null}
					</Animated.View>
					<Animated.View
						removeClippedSubviews={Platform.OS !== 'ios'}
						style={[
							styles.container,
							{
								position: drawerType === 'permanent' ? 'relative' : 'absolute',
								zIndex: drawerType === 'back' ? -1 : 0,
							},
							drawerAnimatedStyle,
							drawerStyle as any,
						]}
					>
						{renderDrawerContent()}
					</Animated.View>
				</Animated.View>
			</PanGestureHandler>
		</DrawerProgressContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		top: 0,
		bottom: 0,
		maxWidth: '100%',
		width: DEFAULT_DRAWER_WIDTH,
	},
	content: {
		flex: 1,
	},
	main: {
		flex: 1,
		...Platform.select({
			// FIXME: We need to hide `overflowX` on Web so the translated content doesn't show offscreen.
			// But adding `overflowX: 'hidden'` prevents content from collapsing the URL bar.
			web: null,
			default: { overflow: 'hidden' },
		}),
	},
});
