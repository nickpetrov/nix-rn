import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  container: {
    width: 55,
    paddingLeft: 20,
  },
  badge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    zIndex: 1,
    borderRadius: 10,
  },
  text: {
    color: 'white',
  },
});
