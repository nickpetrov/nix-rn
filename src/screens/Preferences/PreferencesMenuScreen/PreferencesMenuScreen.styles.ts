import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItem: {
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cal: {
    maxWidth: '60%',
    backgroundColor: Colors.Primary,
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  calText: {
    color: '#fff',
  },
  version: {
    paddingVertical: 20,
    color: '#e1e1e1',
    textAlign: 'center',
  },
});
