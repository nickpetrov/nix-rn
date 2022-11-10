import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  text: {
    flex: 1,
  },
  icon: {
    paddingHorizontal: 5,
  },
});
