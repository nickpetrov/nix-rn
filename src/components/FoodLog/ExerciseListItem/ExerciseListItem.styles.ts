import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: Colors.LightGray,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  header: {},
  time: {
    color: '#999',
    fontSize: 10,
  },
  calories: {
    color: Colors.Primary,
  },
});
