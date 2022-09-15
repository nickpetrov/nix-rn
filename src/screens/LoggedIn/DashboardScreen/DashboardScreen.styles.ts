import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  layout: {
    flex: 1,
    height: '100%',
  },
  content: {
    flex: 1,
  },
  photoMessageContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 15,
    width: '80%',
    height: '25%',
    zIndex: 99,
    top: 150,
    left: '10%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },
  photoMessageTitle: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    height: 40,
  },
  photoMessageTextContainer: {
    flexGrow: 10,
    justifyContent: 'center',
  },
  photoMessageText: {
    textAlign: 'center',
  },
});
