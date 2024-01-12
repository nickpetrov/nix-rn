import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preloaderText: {
    color: '#fff',
  },
  red: {
    color: 'red',
  },
  label: {
    width: '40%',
  },
  itemWrap: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
  },
  invalidInput: {
    borderColor: Colors.Red,
  },
  inputs: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invalid: {
    position: 'absolute',
    margin: 'auto',
    top: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,122,122,1)',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
    zIndex: 100,
  },
  errorMessage: {
    color: Colors.Delete,
    fontSize: 10,
  },
  ingridientItemContainer: {
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  ingridientItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  ingridientItemFooter: {
    width: '15%',
    marginLeft: 10,
    alignItems: 'center',
  },
  ingridientItemImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  m10: {
    margin: 10,
  },
  ml10: {
    marginLeft: 10,
  },
  mb10: {
    marginBottom: 10,
  },
  w50: {
    width: '50%',
    maxWidth: '50%',
  },
  textAlCenter: {
    textAlign: 'center',
  },
  mh8: {
    marginHorizontal: 8,
  },
  flex1: {
    flex: 1,
  },
  fz11: {
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ml8: {
    marginLeft: 8,
  },
  numericInput: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    textAlignVertical: 'top',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#eee',
  },
  prepContainer: {
    backgroundColor: '#ccc',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  alignItemsStretch: {
    alignItems: 'stretch',
  },
  ingridientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ddd',
  },
  ingrBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  ingrBtnIcon: {
    color: Colors.Blue,
  },
  ingrBtnText: {
    marginLeft: 10,
    color: Colors.Blue,
  },
  directionText: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ddd',
  },
  footer: {
    flexDirection: 'row',
    margin: 10,
  },
  btnHidden: {
    minWidth: 50,
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  voiceInput: {
    backgroundColor: '#f5f5f5',
  },
  voiceInputContainer: {
    marginBottom: 20,
  },
  directionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    minWidth: 50
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
});
