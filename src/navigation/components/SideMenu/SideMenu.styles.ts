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
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.Primary,
    height: 50,
    width: '100%',
    paddingTop: 0,
    justifyContent: 'center',
  },
  scrollView: {
    marginTop: 50,
  },
  trackText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
