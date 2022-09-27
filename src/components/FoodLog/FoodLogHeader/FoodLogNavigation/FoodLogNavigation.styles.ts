import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  foodLogNav: {
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    alignItems: 'center',
  },
  navTitleWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  condensedFoodLogNav: {
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 25,
    overflow: 'hidden',
    alignItems: 'center',
  },
  gotoTodayDisclaimerWrapper: {
    position: 'absolute',
    top: 2,
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  gotoTodayDisclaimer: {
    color: '#444',
    fontSize: 11,
  },
  dayLogNavigationText: {
    color: '#fff',
    fontSize: 11,
  },
  navAngleWrapperLeft: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
  navAngleWrapperRight: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  dayLogNavHighlight: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  flex1: {
    flex: 1,
  },
});
