import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  textEmphasized: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
