import {Platform, StyleSheet, StatusBar} from 'react-native';

export const styles = StyleSheet.create({
  offline: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 40 + (StatusBar?.currentHeight || 0),
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
});
