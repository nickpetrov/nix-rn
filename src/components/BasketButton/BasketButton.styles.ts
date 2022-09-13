import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    padding: 10,
  },
  badge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    backgroundColor: 'red',
    zIndex: 1,
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
});
