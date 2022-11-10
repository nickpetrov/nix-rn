import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
  },
  sectionHeader: {
    padding: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
  },
  sectionHeaderTitle: {
    fontStyle: 'italic',
  },
  emptyContainer: {
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  empty: {
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  link: {
    color: Colors.Info,
  },
});
