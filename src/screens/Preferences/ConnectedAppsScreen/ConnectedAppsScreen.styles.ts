import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 15,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    objectFit: 'fill',
  },
  text: {
    fontSize: 16,
  },
  note: {
    textAlign: 'center',
    color: Colors.Gray6,
  },
});
