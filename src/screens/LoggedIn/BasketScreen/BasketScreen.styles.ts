import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  main: {
    backgroundColor: '',
  },
  title: {
    textAlign: 'center',
    marginVertical: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {},
  switchContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  mb20: {
    marginBottom: 20,
  },
});
