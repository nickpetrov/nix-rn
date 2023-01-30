import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 70,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  input: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
    height: 34,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
});
