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
    width: 40,
    height: 40,
    marginRight: 8,
  },
  smallImage: {
    width: 30,
    height: 30,
  },
  foodName: {
    // textTransform: 'capitalize',
  },
  flex1: {
    flex: 1,
  },
  qty: {
    color: Colors.Secondary,
    fontSize: 10,
  },
  calories: {
    color: Colors.Primary,
  },
  caloriesSub: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.Secondary,
  },
  caloriesContainer: {},
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
