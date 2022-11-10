import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mealBuilder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.Gray4,
    padding: 10,
  },
  mealBuilderTilte: {
    fontSize: 22,
    color: '#fff',
  },
  mealBuilderQty: {
    fontSize: 22,
    color: Colors.Primary,
  },
  mealBuilderCal: {
    fontSize: 14,
    color: '#fff',
  },
  mealBuilderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
