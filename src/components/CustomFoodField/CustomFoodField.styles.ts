import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    paddingLeft: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: -1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bebebe',
    width: 70,
    padding: 5,
  },
  label: {
    flex: 1,
  },
  text: {
    width: 50,
    marginLeft: 5,
  },
});
