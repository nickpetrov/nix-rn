import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  caloriesProgress: {
    paddingTop: 5,
    marginHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caloriesProgressLabel: {
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
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  macroTotalsTile: {
    flex: 1,
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
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    flex: 1,
  },
  arrow: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderLeftColor: '#ddd',
    borderLeftWidth: 1,
  },
});
