import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  header: {
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 10,
    color: '#666',
  },
  icon: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
