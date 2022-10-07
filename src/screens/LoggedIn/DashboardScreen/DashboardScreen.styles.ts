import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  swipeItemContainer: {
    backgroundColor: '#fff',
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
  listFooterComponent: {
    flexGrow: 1,
  },
  footerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  offline: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 10,
  },
  offlineContainer: {
    backgroundColor: '#e1e1e1',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  offlineText: {
    fontWeight: '600',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  summaryText: {
    fontSize: 14,
    marginLeft: 5,
  },
});
