import { Colors } from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  footerItem: {
    width: '20%',
    padding: 2,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#444444',
    alignItems: 'center',
  },
  footerItemText: {
    color: '#ffffff',
    fontSize: 9,
  },
  activeTab: {
    backgroundColor: Colors.Gray8,
  }
});
