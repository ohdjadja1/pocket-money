import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No-spend calendar — coming soon</Text>
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
