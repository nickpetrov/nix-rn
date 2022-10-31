import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  headerBtn: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  footer: {
    margin: 10,
  },
  flex1: {
    flex: 1,
  },
  mt20: {
    marginTop: 20,
  },
  note: {
    paddingVertical: 10,
    marginTop: 10,
  },
  red: {
    color: Colors.Delete,
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
  logIcon: {
    position: 'relative',
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 5,
  },
});
