import './App.css';
import positiveGIF from './images/positiveGIF.gif';
import negativeGIF from './images/negativeGIF.gif';
import neutralGIF from './images/neutralGIF.gif';

import React, { useState, useEffect } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();
const chatMesages = new Set();
const APIKey = "AIzaSyBVbinTPWD4oHvoJYsiLzGArsrN55Vvni0";

function App() {
  const [streamURL, setURL] = useState('');
  const [sentimentScore, setSentimentScore] = useState(null);

  useEffect(() => {
    async function getChatMessages(streamURL, APIKey, chatMesages) {

      let streamId = streamURL.substring(32, streamURL.length);
      let liveChatId = '';
    
      // GET ChatID
      try {
        var res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=${APIKey}&id=${streamId}`
        );
    
        var data = await res.json();
    
        if (!data.error) {
          if (!data.items.length == 0) {
            liveChatId = data.items[0].liveStreamingDetails.activeLiveChatId;
          } else {
            console.log('LiveStream not found.');
          }
        }
      } catch {
        console.log('error occured');
      }
    
      // GET the LiveStream Messages
      try {
        var res = await fetch(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?part=id%2C%20snippet&key=${APIKey}&liveChatId=${liveChatId}`
        );
    
        var data = await res.json();
    
        if (!data.error) {
          if (!data.items.length == 0) {
            for (var i = 0; i < data.items.length; i++) {
              chatMesages.add(data.items[i].snippet.displayMessage);
            }
            console.log(' -- ' + i + ' messages returned --')
          }
        }
      } catch (error) {
        console.log('error occured');
      }

      let score = 0;

      chatMesages.forEach((message) => {
        console.log(message);
        score += sentiment.analyze(message).score;
      });
      setSentimentScore(score);
    }

    getChatMessages(streamURL, APIKey, chatMesages);
  }, [streamURL]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Sentiment Analysis</h2>

        <input value={streamURL} onChange={e => setURL(e.target.value)}
          style={{ padding: '20px', fontSize: '20px', width: '90%' }}
        />

        {
          sentimentScore !== null ?
            <p>Sentiment Score: {sentimentScore}</p>
            : ''
        }

        {
          sentimentScore ?
            sentimentScore === 0 ?
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
