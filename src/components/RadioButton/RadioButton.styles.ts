import {StyleSheet} from 'react-native';
import {Colors} from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  root: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.Info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.Info,
  },
});
