import { FC } from 'react';
import { Path, Svg } from 'react-native-svg';

import { Props } from './types';

export const LinkedIn: FC<Props> = ({ size = 24, color = '#FFFFFF' }) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
			<Path
				d="M25.9384 40.5625H20.9497V24.4975H25.9384V40.5625ZM23.4414 22.3061C21.8461 22.3061 20.5522 20.9848 20.5522 19.3896C20.5522 18.6234 20.8566 17.8885 21.3984 17.3467C21.9403 16.8049 22.6751 16.5005 23.4414 16.5005C24.2076 16.5005 24.9425 16.8049 25.4843 17.3467C26.0261 17.8885 26.3305 18.6234 26.3305 19.3896C26.3305 20.9848 25.036 22.3061 23.4414 22.3061ZM44.6094 40.5625H39.6314V32.7421C39.6314 30.8784 39.5938 28.4882 37.0377 28.4882C34.444 28.4882 34.0466 30.5131 34.0466 32.6079V40.5625H29.0633V24.4975H33.8479V26.6889H33.9177C34.5837 25.4267 36.2106 24.0947 38.6378 24.0947C43.6866 24.0947 44.6147 27.4194 44.6147 31.7377V40.5625H44.6094Z"
				fill={color}
			/>
		</Svg>
	);
};

export default LinkedIn;
