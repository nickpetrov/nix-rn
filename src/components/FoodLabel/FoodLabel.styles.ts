import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#666',
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  column: {
    paddingVertical: 2,
    flexDirection: 'row',
  },
});
