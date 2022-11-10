import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  right: {},
  name: {
    fontSize: 12,
  },
  brandName: {
    fontSize: 11,
    color: Colors.Gray9,
  },
  caloriesValue: {
    color: Colors.Primary,
    fontSize: 18,
  },
  foodThumb: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  imageContainer: {
    marginRight: 8,
  },
  textContainer: {},
  textCal: {
    textAlign: 'right',
    fontSize: 12,
    color: Colors.Gray8,
  },
});
