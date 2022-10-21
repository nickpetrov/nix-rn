import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  foodItem: {
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  withoutBorder: {
    borderBottomWidth: 0,
  },
  foodThumb: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  foodName: {
    // textTransform: 'capitalize',
  },
  flex1: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  chevron: {
    marginLeft: 5,
  },
});
