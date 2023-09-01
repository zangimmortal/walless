import { shim } from 'react-native-quick-base64';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

shim();

/* Avoid using node dependent modules */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
process.browser = true;
