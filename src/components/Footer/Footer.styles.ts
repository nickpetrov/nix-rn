import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.Gray4,
  },
  footer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  parentWrapperStyle: {
    backgroundColor: Colors.Primary,
    padding: 0,
  },
  footerTrackItem: {
    flex: 1,
    backgroundColor: Colors.Primary,
    marginTop: -5,
    marginBottom: -5,
    borderRadius: 5,
  },
  footerTrackItemWithTooltip: {
    width: '100%',
  },
  foodTrackItemText: {
    fontSize: 12,
    marginBottom: -2,
  },
  activeFooterTrackItem: {
    backgroundColor: Colors.LightGreen
  }
});
