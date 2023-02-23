import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#fff'},
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
  walk: {
    flex: 1,
    backgroundColor: Colors.Primary,
    paddingTop: 0,
  },
  walkBtn: {
    paddingVertical: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
  walkImage: {
    flex: 1,
    width: '100%',
    height: 'auto',
    margin: 'auto',
  },
  walkText: {
    fontSize: 24,
    color: '#fff',
    marginRight: 5,
  },
});
