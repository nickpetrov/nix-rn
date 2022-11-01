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
    paddingRight: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  labelContainer: {
    width: '30%',
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: '500',
  },
  subLabel: {
    textAlign: 'right',
    fontSize: 12,
  },
  input: {
    flex: 1,
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
  red: {
    color: Colors.Delete,
  },
  unit: {
    color: '#aaa',
    fontSize: 14,
    paddingHorizontal: 10,
    width: '50%',
  },
  unitValue: {
    width: '20%',
    textAlign: 'right',
  },
});
