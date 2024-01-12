import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'white',
    height: 230,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 230,
  },
  webView: {
    flex: 1,
    padding: 0,
    margin: 0,
    // says it's prevent crush when navigate from page with webview
    height: 230,
    opacity: 0.99,
    overflow: 'hidden',
  },
});
