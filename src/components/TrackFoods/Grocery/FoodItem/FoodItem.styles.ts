import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  caloriesValue: {
    color: Colors.Primary,
    fontSize: 16,
  },
  foodThumb: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
});
