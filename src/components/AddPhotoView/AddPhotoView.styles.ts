import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  photoChoose: {
    alignSelf: 'center',
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
});
