import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
  },
  keyboardView: {
    flexGrow: 1,
    backgroundColor: '#fff',
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  logo: {
    width: '60%',
    height: 100,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 10,
    backgroundColor: Colors.BgGray,
  },
  inputWrapper: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {},
  validationError: {
    color: 'red',
    marginVertical: 15,
  },
  link: {
    color: Colors.Info,
  },
  chipsWrapper: {
    padding: 10,
    paddingBottom: 20,
  },
  borderTop: {
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
  },
  selectHeader: {
    padding: 10,
    paddingBottom: 0,
    fontSize: 16,
  },
  selectToggle: {
    backgroundColor: Colors.Info,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  selectToggleText: {
    textAlign: 'center',
    color: '#fff',
  },
  checkBoxContainer: {
    paddingHorizontal: 5,
  },
  itemPN: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  leftPN: {
    flex: 1,
  },
  switch: {
    // marginRight: 10,
  },
  titlePN: {
    fontSize: 16,
    fontWeight: '500',
  },
});
