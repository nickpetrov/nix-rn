import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 10,
    paddingBottom: 0,
  },
  mb10: {
    marginBottom: 10,
  },
  mb8: {
    marginBottom: 8,
  },
  hideContainer: {
    flex: 1,
    marginTop: 10,
  },
  hideContent: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideContentIcon: {
    marginRight: 5,
  },
  hideContentIconRight: {
    marginLeft: 5,
  },
  flex1: {
    flex: 1,
  },
  vitaminContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  dailyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  dailyText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  dailyInput: {
    borderWidth: 1,
    borderColor: '#d7d7d7',
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 8,
    paddingRight: 10,
    width: 60,
    maxWidth: 60,
  },
  dailyBtnContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyBtn: {
    height: 30,
    margin: 'auto',
    maxWidth: 60,
    padding: 0,
  },
  noteInput: {
    height: 75,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 7,
    textAlignVertical: 'top',
    borderColor: '#eee',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#999',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  btn: {
    marginHorizontal: 5,
  },
});
