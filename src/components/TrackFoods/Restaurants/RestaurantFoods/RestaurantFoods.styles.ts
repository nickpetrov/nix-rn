import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
    paddingBottom: 50,
  },
  restaurants: {
    marginHorizontal: 2,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    borderRadius: 4,
  },
  input: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentImage: {
    width: 100,
    height: 60,
    margin: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  contentInput: {
    color: '#6ca6e8',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 12,
  },
  icon: {
    marginHorizontal: 10,
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
