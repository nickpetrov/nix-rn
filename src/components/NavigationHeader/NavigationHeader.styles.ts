import {Colors} from 'constants/Colors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: Colors.Primary,
  },
  header: {
    width: '100%',
    height: 50,
    paddingTop: 0,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.Primary,
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
    minHeight: 30,
    maxHeight: 40
  },
  barcodeInAutocomplete: {
    right: 0,
    alignSelf: 'center'
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 8,
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
