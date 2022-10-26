import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  hiddenItems: {
    flexDirection: 'row',
    height: '100%',
    backgroundColor: '#fff',
  },
  btn: {
    minWidth: 75,
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  bgCopy: {
    backgroundColor: 'orange',
  },
  bgRed: {
    backgroundColor: 'red',
  },
  bgBlue: {
    backgroundColor: Colors.Blue,
  },
});
