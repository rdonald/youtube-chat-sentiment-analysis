import './App.css';
import positiveGIF from './images/positiveGIF.gif';
import negativeGIF from './images/negativeGIF.gif';
import neutralGIF from './images/neutralGIF.gif';

import React, { useState, useEffect } from 'react';
import { LiveStreamingServices } from './services/livestreamServices';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();
const livestreamServices = new LiveStreamingServices();
const chatMesages = new Set();
const APIKey = "AIzaSyBVbinTPWD4oHvoJYsiLzGArsrN55Vvni0";

function App() {
  const [streamURL, setURL] = useState('');
  const [sentimentScore, setSentimentScore] = useState(null);

  useEffect(() => {

    if (streamURL == '')
      return;
    else {
      async function getChatMessages(streamURL, APIKey, chatMesages) {

        let streamId = streamURL.substring(32, streamURL.length);
        let liveChatId = '';

        liveChatId = livestreamServices.getLivestreamChatId(APIKey, streamURL, liveChatId);

        livestreamServices.getLivestreamChatMessages(APIKey, liveChatId, chatMesages)

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
