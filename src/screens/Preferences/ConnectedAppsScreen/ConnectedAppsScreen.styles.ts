import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  iconContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
  },
  healthContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
    flexDirection: 'row',
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 0},
    marginRight: 5,
  },
  image: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 16,
  },
});
