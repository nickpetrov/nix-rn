import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    padding: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    margin: 5,
  },
  text: {
    flex: 1,
  },
  icon: {
    paddingHorizontal: 10,
  },
});
