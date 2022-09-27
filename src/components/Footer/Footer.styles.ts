import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#444',
  },
  footer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  footerTrackItem: {
    backgroundColor: Colors.Primary,
    height: 50,
    paddingTop: 5,
    marginTop: -5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  foodTrackItemText: {
    fontSize: 12,
    marginBottom: -2,
  },
});
