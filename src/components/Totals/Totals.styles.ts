import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#eee',
  },
  overviewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 16,
  },
  caloriesValue: {
    color: Colors.Primary,
    fontSize: 20,
  },
  macroTotals: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  macroTotalsTile: {
    width: '33.333333%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
  },
  macroValue: {
    fontSize: 11,
    color: '#0073e6',
    marginRight: 2,
  },
  macroTitle: {
    fontSize: 11,
    color: '#002e5c',
  },
});
