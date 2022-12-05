import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {flex: 1, paddingBottom: 70, backgroundColor: '#fff'},
  menuItem: {
    borderBottomColor: Colors.Highlight,
    borderBottomWidth: 1,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width: 30,
  },
  menuItemText: {
    fontWeight: '500',
  },
  container: {background: '#fff', minHeight: '100%'},
  text: {
    margin: 10,
    color: '#444',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  terms: {
    paddingVertical: 10,
    paddingHorizontal: 20,
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
