# YouTube Chat Sentiment Analysis

This project determines the general sentiment of a youtube chat when a streamer is live. Using the YouTube LiveStreamingAPI we can retrieve batches of live chat messages then run sentiment analysis on each message. Based on the results of the newly queried batch of chat messages the application will assign a sentiment score that a streamer and chat can see.

# LiveStreamingAPI
https://developers.google.com/youtube/v3/live/getting-started

Specific API methods utilzied:
- Retrieving a batch of messages in chat: https://www.googleapis.com/youtube/v3/liveChat/messages?part=id%2C%20snippet&key=${APIKey}&liveChatId=${chatid}
- Retrieving a chatId from a stream URL: https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=${APIKey}&id=${id}

# Google API Keys
To use the LiveStreamingAPI provided by YouTube you will need an API Key. You can obtain this key from https://console.cloud.google.com. 

Once there follow these steps: 
- Click on the menu bar (top left)
- Click on 'APIs & Services' 
- Click into 'Enabled APIs & Services'
- Navigate into 'Credentials' and Create an API key then enable it on 'YouTube Data API v3'

Once this is done replace <API KEY HERE> in the App.js with the API Key you just created on the google cloud.