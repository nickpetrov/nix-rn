import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  foodLogHeader: {
    backgroundColor: '#eee',
    width: '100%',
    alignItems: 'stretch',
  },
  foodLogNav: {
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
  },
  dayLogNavigationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navAngleWrapper: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesProgress: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caloriesProgressLabel: {
    width: '33.33333%',
    alignItems: 'center',
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
  },
});
