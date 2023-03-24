import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {styles} from './Graph.styles';

type Props = {
  weightUnit: string;
  chartData: {
    labels: string[];
    values: number[];
  };
};

export default function Graph({weightUnit, chartData}: Props) {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [onLoaded, setOnLoaded] = useState<boolean>(false);

  const HTML = `  
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style> body { padding: 0; margin: 0; } #chart > div { margin: 0 auto; } </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js"></script>
    <canvas id="chart" height="200"></canvas>
    <script>
    const ctx = document.getElementById('chart');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(chartData.labels)},
        datasets: [{
          data: ${JSON.stringify(chartData.values)},
          borderWidth: 2,
          fill: true,
          borderColor: "#97BBCD",
          backgroundColor: "rgba(151,187,205, 0.2)",
          lineTension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#97BBCD',
          pointBorderColor: "#fff",
          pointStroke: 'rgb(0, 0, 180)',
          pointHitRadius: 10,
        }],
      },
      options: {
        scales: {
          x: {
              ticks: {
                  autoSkip: false,
              },
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (context) => (context.formattedValue || '') + "${` ${weightUnit}`}",
            },
          },
        },
      },
    });
    </script>
  `;

  useEffect(() => {
    if (onLoaded && chartData) {
      setIsLoading(false);
    }
  }, [chartData, onLoaded]);

  const onLoadWebView = () => {
    setOnLoaded(true);
  };
  const onMessage = (event: WebViewMessageEvent) => {
    console.log(event.nativeEvent.data);
  };

  return (
    <View style={styles.labelContainer}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color={'gray'} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{html: HTML}}
        onLoad={onLoadWebView}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        allowUniversalAccessFromFileURLs
        androidHardwareAccelerationDisabled
        onMessage={onMessage}
      />
    </View>
  );
}
