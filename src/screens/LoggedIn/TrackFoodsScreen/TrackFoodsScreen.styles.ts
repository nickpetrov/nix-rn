import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {flex: 1},
  tabs: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
    backgroundColor: '#fff',
  },
  tab: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomColor: Colors.Primary,
  },
  tabText: {
    color: Colors.Primary,
    fontWeight: '600',
  },
  footer: {},
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    marginHorizontal: 15,
  },
});
