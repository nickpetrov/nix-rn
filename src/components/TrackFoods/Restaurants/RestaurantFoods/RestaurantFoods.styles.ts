import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  restaurants: {
    flex: 1,
    paddingTop: 8,
    marginHorizontal: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
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
  },
  empty: {
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  link: {
    color: Colors.Info,
  },
  inputContainer: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
