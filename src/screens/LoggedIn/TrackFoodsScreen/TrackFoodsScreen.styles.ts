import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {flex: 1},
  tabs: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 2,
    width: '100%',
  },
  tab: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#bebebe',
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginRight: 2,
  },
  footer: {},
});
