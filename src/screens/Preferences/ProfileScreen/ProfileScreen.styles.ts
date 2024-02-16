import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  field: {
    marginRight: 15,
    marginBottom: 2,
    color: '#666',
  },
  pickerContainer: {
    paddingHorizontal: 5,
    borderColor: '#666',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  picker: {
    width: '100%',
    minWidth: '100%',
  },
  mb10: {
    marginBottom: 10,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  btnContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  submitContainer: {
    marginBottom: 50,
  },
  submitBtn: {
    flex: 1,
    marginHorizontal: 8,
    position: 'absolute',
    width: '50%',
  },
  input: {
    flexGrow: 0,
    minWidth: 40,
    maxWidth: 40,
    paddingHorizontal: 0,
  },
  labelContainerStyle: {
    paddingHorizontal: 0,
  },
  labelContainerStyleFull: {
    flex: 1,
    paddingHorizontal: 0,
    width: 'auto',
  },
  selectIcon: {
    color: Colors.Secondary,
    alignSelf: 'center',
    marginLeft: 10,
    top: -2,
  },
  inputIcon: {
    color: Colors.Secondary,
  },
  unit: {
    color: '#000',
    width: 'auto',
    flex: 1,
    paddingHorizontal: 0,
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    minWidth: 50,
  },
  saveBtn: {
    backgroundColor: Colors.Primary,
    padding: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorStyles: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    color: Colors.Red,
  },
  modalLabel: {
    paddingHorizontal: 5,
  },
  flex1: {
    flex: 1,
  },
  initValueTextStyle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
  optionTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedItemTextStyle: {
    fontSize: 16,
    color: Colors.Info,
    fontWeight: '500',
  },
  textRight: {
    textAlign: 'right',
  },
});
