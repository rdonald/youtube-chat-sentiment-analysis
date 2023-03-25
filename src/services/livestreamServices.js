const LiveStreamingServices = {

    getLivestreamChatId: async function(APIKey, streamURL, liveChatId) {
        let streamId = streamURL.substring(32, streamURL.length);

        // GET ChatID
        try {
            var res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=${APIKey}&id=${streamId}`
            );

            var data = await res.json();

            if (!data.error) {
                if (!data.items.length == 0) {
                    return liveChatId = data.items[0].liveStreamingDetails.activeLiveChatId;
                } else {
                    console.log('LiveStream not found.');
                }
            }
        } catch {
            console.log('error occured');
        }
    },

    getLivestreamChatMessages: async function(APIKey, liveChatId, chatMesages) {
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
                }
            }
        } catch (error) {
            console.log('error occured');
        }
    }
}

export default LiveStreamingServices;