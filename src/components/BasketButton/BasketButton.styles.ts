import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    // width: 55,
  },
  badge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -5,
    top: 0,
    backgroundColor: 'red',
    zIndex: 1,
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
});
