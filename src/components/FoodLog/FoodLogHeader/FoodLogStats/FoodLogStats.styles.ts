import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  caloriesProgress: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caloriesProgressLabel: {
    width: '33.33333%',
    alignItems: 'center',
  },
  caloriesProgressLabelText: {
    fontSize: 12,
  },
  progressBarWrapper: {
    height: 7,
    marginVertical: 5,
    marginHorizontal: 7,
  },
  progressBar: {
    backgroundColor: 'rgba(200, 205, 200, 0.6)',
    overflow: 'hidden',
    borderRadius: 3,
    height: '100%',
  },
  progressBarColor: {
    height: '100%',
    overflow: 'hidden',
  },
  progressBarColorShadow: {
    borderWidth: 1,
    height: 10,
    backgroundColor: 'transparent',
    margin: -2,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: -2,
      width: 0,
    },
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
  hide: {
    display: 'none',
  },
});
