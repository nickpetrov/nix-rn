import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '100%',
    marginTop: 1,
    paddingRight: 10,
    paddingVertical: 20,
    backgroundColor: Colors.Info,
    flexDirection: 'row',
  },
  imageContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});
