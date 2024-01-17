import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  keyboardView: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  loginWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    padding: 16,
  },
  logo: {
    alignSelf: 'center',
    width: '60%',
    height: 100,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    minWidth: 65,
    backgroundColor: Colors.BgGray,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
  },
  backBtnIcon: {
    fontSize: 20,
    marginRight: 5
  },
});
