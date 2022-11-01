import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    alignItems: 'center',
    width: '100%',
    marginTop: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.Info,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
    fontSize: 14,
    lineHeight: 19.6,
  },
  disclaimer: {
    textAlign: 'center',
    color: Colors.Gray8,
    paddingTop: 10,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  offline: {
    padding: 5,
    textAlign: 'center',
  },
});
