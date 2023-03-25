import './App.css';
import positiveGIF from './images/positiveGIF.gif';
import negativeGIF from './images/negativeGIF.gif';
import neutralGIF from './images/neutralGIF.gif';

import React, { useState, useEffect } from 'react';
import LiveStreamingServices from "./services/livestreamServices.js";
import Sentiment from 'sentiment';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';

const sentiment = new Sentiment();
const chatMesages = new Set();
const APIKey = "<API_KEY_HERE>";

const options = {

  chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '80%'
  },

  title: {
      text: 'Speedometer'
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
      min: 0,
      max: 200,
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
      plotBands: [{
          from: 0,
          to: 120,
          color: '#55BF3B', // green
          thickness: 20
      }, {
          from: 120,
          to: 160,
          color: '#DDDF0D', // yellow
          thickness: 20
      }, {
          from: 160,
          to: 200,
          color: '#DF5353', // red
          thickness: 20
      }]
  },

  series: [{
      name: 'Speed',
      data: [80],
      tooltip: {
          valueSuffix: ' km/h'
      },
      dataLabels: {
          format: '{y} km/h',
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

function App() {
  var Highcharts = require('highcharts');
  require('highcharts/highcharts-more')(Highcharts);

  const [streamURL, setURL] = useState('');
  const [sentimentScore, setSentimentScore] = useState(null);

  useEffect(() => {

    if (streamURL == '')
      return;
    else {
      async function getChatMessages(streamURL, APIKey, chatMesages) {
        let liveChatId = '';

        liveChatId = await LiveStreamingServices.getLivestreamChatId(APIKey, streamURL, liveChatId);

        await LiveStreamingServices.getLivestreamChatMessages(APIKey, liveChatId, chatMesages);

        let sentimentIterationScore = 0;

        // Iterate over each chat message and analyze it for sentiment analysis
        chatMesages.forEach((message) => {
          console.log(message);
          sentimentIterationScore += sentiment.analyze(message).score;
        });

        setSentimentScore(sentimentIterationScore);
      }

      // Get new Chat Messages every 5 seconds
      const intervalId = setInterval(() => {
        getChatMessages(streamURL, APIKey, chatMesages)
      }, 1000 * 5) // in milliseconds

      return () => clearInterval(intervalId)
    }
  }, [streamURL]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sentiment Analysis</h2>

        <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>

        <input value={streamURL} onChange={e => setURL(e.target.value)} style={{ padding: '20px', fontSize: '20px', width: '90%' }}/>

        {
          sentimentScore !== null ? <p>Sentiment Score: {sentimentScore}</p> : ''
        }

        {
          sentimentScore ? sentimentScore === 0 ?
            <img src={neutralGIF} alt="neutral" />
            :
            sentimentScore > 0 ?
              <img src={positiveGIF} alt="postive" />
              :
              <img src={negativeGIF} alt="negative" />
            : ''
        }

      </header>
    </div>
  );
}

export default App;
