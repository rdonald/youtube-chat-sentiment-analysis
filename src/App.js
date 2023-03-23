import './App.css';

import React, { useState, useEffect } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();
const chatMesages = new Set();
const APIKey = "AIzaSyBVbinTPWD4oHvoJYsiLzGArsrN55Vvni0";
let globalScore = 0;


function App() {
  const [streamURL, setURL] = useState('');
  const [sentimentScore, setSentimentScore] = useState(0);

  useEffect(() => {
    updateSentimentScore(streamURL);
    setSentimentScore(globalScore);
  }, [streamURL]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>YouTube Chat Sentiment Analysis</h2>

        <input value={streamURL} onChange={e => setURL(e.target.value)} style={{ padding: '20px', fontSize: '20px', width: '90%' }}/>

        {
          <p>Sentiment Score: {sentimentScore}</p>
        }
      </header>
    </div>
  );
}

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
          // console.log(data.items[i].snippet.displayMessage);
          chatMesages.add(data.items[i].snippet.displayMessage);
        }
        console.log(' -- ' + i + ' messages returned --')
      }
    }
  } catch (error) {
    console.log('error occured');
  }

  chatMesages.forEach((message) => {
    console.log(message);
    globalScore += sentiment.analyze(message).score
  });
}

async function updateSentimentScore(streamURL) {
  await getChatMessages(streamURL, APIKey, chatMesages);
  return;
}

export default App;
