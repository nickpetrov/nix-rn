import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {},
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  label: {
    width: '30%',
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  errorInput: {
    borderColor: 'red',
  },
});
