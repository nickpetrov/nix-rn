import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    padding: 15,
    borderBottom: '1 solid #ddd',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 30,
    height: 30,
  },
  left: {},
  info: {
    marginLeft: 40,
  },
  name: {
    marginTop: 3,
    fontSize: 14,
  },
  serving: {
    textOverflow: 'normal',
    whiteSpace: 'normal',
    color: '#888',
    fontSize: 13,
  },
  right: {},
  text: {},
});
