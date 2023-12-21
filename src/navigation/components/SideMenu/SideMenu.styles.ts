import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  menuItemWrapper: {
    flex: 1,
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
    flexDirection: 'row',
    backgroundColor: Colors.Primary,
    // height: 50,
    paddingBottom: 30,
    width: '100%',
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
