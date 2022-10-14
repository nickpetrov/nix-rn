import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  pieContainer: {
    marginVertical: 10,
  },
  p10: {
    padding: 10,
  },
  mr10: {
    marginRight: 10,
  },
  mt10: {
    marginTop: 10,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  textarea: {
    height: 75,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 7,
    textAlignVertical: 'top',
    borderColor: '#eee',
    marginHorizontal: 10,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  fz16: {
    fontSize: 16,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderContainer: {
    padding: 10,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#bbb  ',
  },
  share: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  photoBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  photoBtn: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoBtnText: {
    paddingHorizontal: 5,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    height: 400,
  },
  image: {
    height: '100%',
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
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 50,
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
  uploadBtn: {
    backgroundColor: Colors.Primary,
    padding: 10,
    height: 40,
    borderRadius: 10,
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  uploadBtnText: {
    color: '#fff',
    textAlign: 'center',
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
  hideContent: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideContentIcon: {
    marginRight: 5,
  },
  hideContentIconRight: {
    marginLeft: 5,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: Colors.LightGray,
  },
  noPhoto: {
    marginHorizontal: 10,
    textAlign: 'center',
  },
  shareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtnContainer: {
    marginVertical: 10,
  },
  backBtn: {
    alignSelf: 'center',
  },
});
