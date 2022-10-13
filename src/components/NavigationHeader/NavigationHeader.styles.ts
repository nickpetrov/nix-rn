import {Colors} from 'constants/Colors';
import {StatusBar, StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: Platform.OS === 'ios' ? 50 : 50 + (StatusBar?.currentHeight || 0),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.Primary,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingHorizontal: 10,
  },
  autocompleteWrapper: {
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    marginHorizontal: 15,
  },
  autocomplete: {
    backgroundColor: '#ffffff',
    padding: 5,
    flex: 1,
    borderRadius: 4,
    height: 30,
  },
  barcodeInAutocomplete: {
    position: 'absolute',
    right: 10,
    top: -5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  emptyRight: {
    width: 40,
  },
});
