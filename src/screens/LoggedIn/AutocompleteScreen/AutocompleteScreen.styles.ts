import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
  },
  main: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginTop: 3,
  },
  tab: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bebebe',
    borderBottomWidth: 0,
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 4,
  },
  footerText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 16,
  },
  note: {
    textAlign: 'center',
  },
});
