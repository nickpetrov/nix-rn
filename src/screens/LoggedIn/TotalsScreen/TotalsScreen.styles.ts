import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  mb10: {
    marginBottom: 10,
  },
  mb8: {
    marginBottom: 8,
  },
  hideContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#666',
    borderTopColor: '#666',
    marginTop: 10,
  },
  hideContent: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  vitaminContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  btnContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 100,
  },
  dailyContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dailyInput: {
    borderWidth: 1,
    padding: 9,
    flex: 1,
    marginTop: 8,
    marginRight: 8,
  },
  noteInput: {
    height: 180,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
});
