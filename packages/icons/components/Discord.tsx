import type { FC } from 'react';
import { Path, Svg } from 'react-native-svg';

import type { IconProps } from './types';

export const Discord: FC<IconProps> = ({ size = 24, color = '#FFFFFF' }) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
			<Path
				d="M40.2299 20.9114C38.2665 20.0204 36.1408 19.3737 33.9264 19.0001C33.907 18.9995 33.8877 19.003 33.8698 19.0105C33.852 19.0179 33.836 19.0291 33.8231 19.0432C33.5574 19.5174 33.2473 20.1354 33.0407 20.6096C30.692 20.2647 28.3034 20.2647 25.9548 20.6096C25.7481 20.121 25.4381 19.5174 25.1576 19.0432C25.1428 19.0144 25.0985 19.0001 25.0543 19.0001C22.8399 19.3737 20.7289 20.0204 18.7508 20.9114C18.736 20.9114 18.7212 20.9258 18.7065 20.9402C14.6911 26.7893 13.5839 32.4803 14.1302 38.1138C14.1302 38.1426 14.1449 38.1713 14.1744 38.1857C16.8317 40.0827 19.3855 41.2324 21.9099 41.994C21.9542 42.0084 21.9985 41.994 22.0132 41.9653C22.6037 41.1749 23.1352 40.3414 23.5928 39.4647C23.6223 39.4072 23.5928 39.3497 23.5337 39.3354C22.6923 39.0192 21.8951 38.6455 21.1127 38.2144C21.0537 38.1857 21.0537 38.0994 21.098 38.0563C21.2603 37.9414 21.4227 37.812 21.5851 37.697C21.6146 37.6683 21.6589 37.6683 21.6885 37.6827C26.7667 39.939 32.2435 39.939 37.2627 37.6827C37.2922 37.6683 37.3365 37.6683 37.366 37.697C37.5284 37.8264 37.6908 37.9414 37.8532 38.0707C37.9122 38.1138 37.9122 38.2 37.8384 38.2288C37.0708 38.6743 36.2589 39.0336 35.4174 39.3497C35.3584 39.3641 35.3436 39.436 35.3584 39.4791C35.8307 40.3557 36.3622 41.1893 36.9379 41.9797C36.9822 41.994 37.0265 42.0084 37.0708 41.994C39.6099 41.2324 42.1638 40.0827 44.821 38.1857C44.8505 38.1713 44.8653 38.1426 44.8653 38.1138C45.5148 31.6036 43.7876 25.9557 40.289 20.9402C40.2742 20.9258 40.2594 20.9114 40.2299 20.9114ZM24.3604 34.6791C22.8399 34.6791 21.5704 33.3138 21.5704 31.6324C21.5704 29.9509 22.8104 28.5857 24.3604 28.5857C25.9252 28.5857 27.1653 29.9653 27.1505 31.6324C27.1505 33.3138 25.9105 34.6791 24.3604 34.6791ZM34.6498 34.6791C33.1292 34.6791 31.8597 33.3138 31.8597 31.6324C31.8597 29.9509 33.0997 28.5857 34.6498 28.5857C36.2146 28.5857 37.4546 29.9653 37.4398 31.6324C37.4398 33.3138 36.2146 34.6791 34.6498 34.6791Z"
				fill={color}
			/>
		</Svg>
	);
};

export default Discord;
