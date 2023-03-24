import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'white',
    height: 220,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  webView: {
    flex: 1,
    padding: 0,
    margin: 0,
    // says it's prevent crush when navigate from page with webview
    height: 220,
    opacity: 0.99,
    overflow: 'hidden',
  },
});
