import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  foodItem: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  foodThumb: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  foodName: {
    textTransform: 'capitalize',
  },
  flex1: {
    flex: 1,
  },
  qty: {
    color: '#999',
    fontSize: 10,
  },
  calories: {
    color: Colors.Primary,
  },
});
