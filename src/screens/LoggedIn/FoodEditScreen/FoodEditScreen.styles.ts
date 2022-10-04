import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
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
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    padding: 8,
    minHeight: 200,
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
  },
  photoBtn: {
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 5,
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
});
