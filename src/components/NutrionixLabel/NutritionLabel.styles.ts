import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'white',
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  webView: {
    flex: 1,
    padding: 0,
    margin: 0,
    // says it's prevent crush when navigate from page with webview
    opacity: 0.99,
    overflow: 'hidden',
  },
});
