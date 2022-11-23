import {Colors} from 'constants/Colors';
import {StyleSheet, Platform, StatusBar} from 'react-native';

export const styles = StyleSheet.create({
  menuItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
    padding: 10,
  },
  iconWrapper: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manuItemText: {},
  iconStyle: {
    position: 'relative',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 15,
    marginRight: 3,
  },
  track: {
    backgroundColor: Colors.Primary,
    height: Platform.OS === 'ios' ? 50 : 50 + (StatusBar?.currentHeight || 0),
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    justifyContent: 'center',
  },
  trackText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
