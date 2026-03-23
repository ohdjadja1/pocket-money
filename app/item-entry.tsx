import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function ItemEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Item entry — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
  },
  text: {
    ...theme.typography.body,
  },
});
