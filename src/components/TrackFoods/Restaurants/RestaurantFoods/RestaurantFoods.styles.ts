import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 70,
    backgroundColor: '#fff',
  },
  container: {
    padding: 8,
  },
  input: {
    width: '100%',
    padding: 8,
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
    fontWeight: 'bold',
    fontSize: 12,
  },
  icon: {
    paddingHorizontal: 10,
  },
});
