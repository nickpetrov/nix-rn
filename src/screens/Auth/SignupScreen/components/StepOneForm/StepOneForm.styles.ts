import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  formikRoot: {
    flex: 1,
  },
  inputs: {
    flex: 1,
  },
  inputRoot: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  labelContainerStyle: {
    width: '35%',
  },
  inputRootWithoutBorder: {
    borderBottomWidth: 0,
  },
  validationError: {
    color: 'red',
    marginVertical: 15,
  },
  link: {
    color: Colors.Info,
  },
  countrySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.LightGray,
  },
  countrySelectText: {
    width: '35%',
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  checkBoxContainer: {
    paddingHorizontal: 5,
  },
  errorStyle: {
    paddingBottom: 10,
    fontSize: 14,
  },
});
