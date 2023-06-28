import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  title: {
    borderBottomColor: Colors.Highlight,
    borderBottomWidth: 1,
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
  },
  content: {
    padding: 5,
  },
  text: {
    textAlign: 'center',
  },
  btns: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    height: 30,
    marginHorizontal: 5,
  },
  tooltip: {
    minWidth: 220,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
  },
});
