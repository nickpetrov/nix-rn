import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  left: {
    flex: 1,
  },
  switch: {
    // marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
