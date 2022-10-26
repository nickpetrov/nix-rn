import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  createNew: {
    marginRight: 10,
    borderRadius: 5,
    borderColor: Colors.Gray7,
    borderWidth: 0.5,
    padding: 5,
  },
  swipeContainer: {
    padding: 4,
    marginTop: 10,
    borderTopColor: Colors.LightGray,
    borderTopWidth: 1,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  swipeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  saved: {
    position: 'absolute',
    margin: 'auto',
    alignSelf: 'center',
    backgroundColor: '#74d490',
    color: '#096122',
    borderRadius: 5,
    width: 120,
    padding: 0,
    lineHeight: 24,
    height: 24,
    textAlign: 'center',
  },
  recipeListItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#bebebe',
  },
  inputQuery: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    margin: 8,
    marginTop: 2,
    backgroundColor: Colors.LightGray,
  },
  row: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
  },
  empty: {
    padding: 10,
    borderBottomColor: Colors.LightGray,
    borderBottomWidth: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 12,
  },
  swipeItemContainer: {},
});
