import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#eee',
  },
  overviewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 16,
  },
  caloriesValue: {
    color: Colors.Primary,
    fontSize: 20,
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  macroTotals: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  macroTotalsTile: {
    flex: 1,
    textAlign: 'center',
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
    marginRight: 4,
  },
  macroTitle: {
    minWidth: 50,
    fontSize: 11,
    color: '#002e5c',
  },
});
