import type { FC } from 'react';
import type { ViewStyle } from 'react-native';
import { Image, Linking, StyleSheet } from 'react-native';
import { Hoverable, Text, View } from '@walless/gui';
import { ArrowRight } from '@walless/icons';

import type { NewsArticle } from './internal';

interface Props {
	data: NewsArticle;
	style: ViewStyle;
}

export const CardNews: FC<Props> = ({ data, style }) => {
	return (
		<Hoverable
			style={[styles.cardContainer, style]}
			onPress={() => Linking.openURL(data.link)}
		>
			<View style={styles.cardContent}>
				<Text style={styles.cardTitle} numberOfLines={2}>
					{data.title}
				</Text>
				<Text style={styles.cardDescription} numberOfLines={3}>
					{data.description}
				</Text>
				<View style={styles.cardLink}>
					<View horizontal style={{ alignItems: 'center' }}>
						<Text style={styles.cardLinkText}>Read</Text>
						<ArrowRight size={20} />
					</View>
				</View>
			</View>
			<Image source={data.image} style={styles.image} />
		</Hoverable>
	);
};

export default CardNews;

const styles = StyleSheet.create({
	cardContainer: {
		flex: 1,
		marginRight: 20,
		backgroundColor: '#202D38',
		padding: 20,
		borderRadius: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
	},
	cardContent: {
		flex: 1,
		marginRight: 30,
	},
	cardTitle: {
		fontSize: 18,
		lineHeight: 26,
		fontWeight: '500',
		color: '#ffffff',
	},
	cardDescription: {
		marginTop: 10,
		lineHeight: 20,
		color: '#566674',
	},
	cardLink: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	cardLinkText: {
		fontSize: 16,
		color: '#ffffff',
		marginRight: 5,
	},
	image: {
		aspectRatio: 283 / 196,
		width: 250,
		borderRadius: 10,
	},
});
