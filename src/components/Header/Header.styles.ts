import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  header: {
    height: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    right: 10,
  },
  autocompleteWrapper: {
    flexDirection: 'row',
    position: 'relative',
    // paddingHorizontal: 35
  },
  autocomplete: {
    backgroundColor: '#ffffff',
    padding: 5,
    flex: 1,
    maxWidth: '95%',
    borderRadius: 4,
    height: 30,
  },
  barcodeInAutocomplete: {
    position: 'absolute',
    right: '10%',
    top: -5,
  },
});
