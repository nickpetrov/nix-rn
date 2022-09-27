import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {flex: 1, paddingBottom: 70, backgroundColor: '#fff'},
  menuItem: {
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  container: {background: '#fff', minHeight: '100%'},
  text: {
    margin: 10,
    color: '#00f',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  terms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  footer: {
    flex: 1,
  },
  webView: {
    width: '100%',
  },
});
