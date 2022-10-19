import {Colors} from 'constants/Colors';
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
  swipeNote: {
    padding: 3,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.Secondary,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  title: {
    marginBottom: 10,
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
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  mb20: {
    marginBottom: 20,
  },
  swipeItemContainer: {
    backgroundColor: '#fff',
  },
  appearContainer: {
    padding: 15,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  errorMessage: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: Colors.Delete,
  },
  photoBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  photoBtnAndroid: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  photoBtn: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoBtnText: {
    paddingHorizontal: 5,
  },
  photoChoose: {
    position: 'absolute',
    bottom: 25,
    right: 10,
    zIndex: 1,
    backgroundColor: Colors.BgGray,
    borderRadius: 10,
  },
  photoChooseItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 200,
  },
  photoChooseItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoChooseItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  photoChooseItemText: {},
  imageContainer: {
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    height: 400,
    width: '100%',
  },
  imageError: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgb(242,222,222)',
  },
  imageErrorText: {
    textAlign: 'center',
    color: 'rgb(208,151,149)',
  },
  deleteBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Delete,
  },
  noPhoto: {
    marginHorizontal: 10,
    textAlign: 'center',
  },
  uploadPhotoLoading: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    textAlign: 'center',
    color: Colors.Delete,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  link: {
    fontSize: 12,
    color: Colors.Secondary,
  },
  reportNutrionContainer: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  barcodeBtn: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: Colors.Blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
