import type { ComponentType, FC, ReactElement } from 'react';
import type { ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import type { TokenDocument } from '@walless/store';

import TokenItem from './Item';
import ListEmpty from './ListEmpty';
import Separator from './Separator';

interface Props {
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
	items: TokenDocument[];
	ListHeaderComponent?: ComponentType<TokenDocument> | ReactElement;
}

export const TokenList: FC<Props> = ({
	style,
	contentContainerStyle,
	items,
	ListHeaderComponent,
}) => {
	const renderItem: ListRenderItem<TokenDocument> = ({ item, index }) => {
		const isFirst = index === 0;
		const isLast = index === items.length - 1;

		return (
			<TokenItem
				index={index}
				item={item}
				style={[isFirst && styles.firstItem, isLast && styles.lastItem]}
			/>
		);
	};

	return (
		<FlatList
			ListHeaderComponent={ListHeaderComponent}
			showsVerticalScrollIndicator={false}
			style={style}
			contentContainerStyle={contentContainerStyle}
			data={items}
			renderItem={renderItem}
			ItemSeparatorComponent={Separator}
			ListEmptyComponent={ListEmpty}
		/>
	);
};

export default TokenList;

const styles = StyleSheet.create({
	firstItem: {
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	lastItem: {
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
	},
});
