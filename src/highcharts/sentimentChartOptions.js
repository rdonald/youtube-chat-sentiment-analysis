import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';

const SentimentChartOptions = {
  chart: {
    type: 'gauge',
    plotBackgroundColor: null,
    plotBackgroundImage: null,
    plotBorderWidth: 0,
    plotShadow: false,
    height: '80%'
  },

  title: {
    text: 'YouTube Chat Sentiment Score'
  },

  credits: {
    enabled: false
  },

  pane: {
    startAngle: -90,
    endAngle: 89.9,
    background: null,
    center: ['50%', '75%'],
    size: '110%'
  },

  // the value axis
  yAxis: {
    min: -100,
    max: 100,
    tickPixelInterval: 72,
    tickPosition: 'inside',
    tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
    tickLength: 20,
    tickWidth: 2,
    minorTickInterval: null,
    labels: {
      distance: 20,
      style: {
        fontSize: '14px'
      }
    },
    plotBands: [
      {
        from: -100,
        to: -40,
        color: '#DF5353', // red
        thickness: 20,
        label: {
          text: 'Malding',
          align: 'center'
        }
      },
      {
        from: -40,
        to: 0,
        color: '#ffcccb', // light red
        thickness: 20,
        label: {
          text: 'Annoyed',
          align: 'center'
        }
      },
      {
        from: -0,
        to: 40,
        color: '#90EE90', // light green
        thickness: 20,
        label: {
          text: 'Amused',
          align: 'center'
        }
      },
      {
        from: 40,
        to: 100,
        color: '#55BF3B', // green
        thickness: 20,
        label: {
          text: 'Poggers',
          align: 'center'
        }
      }]
  },

  series: [{
    name: 'Sentiment Score',
    data: [0],
    dataLabels: {
      format: 'Sentiment Score: {y}',
      borderWidth: 0,
      color: (
        Highcharts.defaultOptions.title &&
        Highcharts.defaultOptions.title.style &&
        Highcharts.defaultOptions.title.style.color
      ) || '#333333',
      style: {
        fontSize: '16px'
      }
    },
    dial: {
      radius: '80%',
      backgroundColor: 'gray',
      baseWidth: 12,
      baseLength: '0%',
      rearLength: '0%'
    },
    pivot: {
      backgroundColor: 'gray',
      radius: 6
    }
  }]
}

export default SentimentChartOptions;