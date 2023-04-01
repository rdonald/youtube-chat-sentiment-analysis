import './App.css';

import React, { useState, useEffect } from 'react';
import Sentiment from 'sentiment';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import { embed } from '@trufflehq/sdk'

import LiveStreamingServices from "./services/livestreamServices.js";
import SentimentChartOptions from './highcharts/sentimentChartOptions.js'

const sentiment = new Sentiment();
const chatMesages = new Set();
const APIKey = "AIzaSyAz-LH1uNPnJiU_mir_RAM5nAiTAIldYQA";
const URL = prompt('Paste Stream URL:');

function App() {
  var Highcharts = require('highcharts');
  require('highcharts/highcharts-more')(Highcharts);

  const [streamURL, setStreamURL] = useState(URL);
  const [sentimentScore, setSentimentScore] = useState(null);
  const [chartOptions, setChartOptions] = useState(SentimentChartOptions);

  useEffect(() => {
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

      if (sentimentIterationScore > 100)
        sentimentIterationScore = 100;
      else if (sentimentIterationScore < -100)
        sentimentIterationScore = -100;

      setSentimentScore(sentimentIterationScore);

      setChartOptions({
        series: {
          data: [sentimentIterationScore],
        },
      });
    }

    // Get new Chat Messages every 5 seconds
    const intervalId = setInterval(() => {
      getChatMessages(streamURL, APIKey, chatMesages)
    }, 1000 * 5) // in milliseconds

    return () => clearInterval(intervalId)

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <HighchartsReact highcharts={Highcharts} options={chartOptions}></HighchartsReact>
      </header>
    </div>
  );
}

export default App;
