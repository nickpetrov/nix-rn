import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  header: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  autocompleteWrapper: {
    flexDirection: 'row',
    position: 'relative',
    // paddingHorizontal: 35
  },
  autocomplete: {
    backgroundColor: '#ffffff',
    width: '95%',
    padding: 5,
    borderRadius: 4,
    height: 30,
  },
  barcodeInAutocomplete: {
    position: 'absolute',
    right: '5%',
    top: -5,
  },
});
