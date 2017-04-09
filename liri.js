// LIRI is a Language Interpretation and Recognition Interface

// npm package
var keys = require("./keys.js");
var fs = require('fs');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

// Creating a function to find out the artist name from the spotify npm package
var getArtistNames = function(artist) {
  return artist.name;
};

// Creating a function to find out the song from the spotify npm package
var getMeSpotify = function(songName) {
  //If song dose not exist, find "What's my age again"
  if (songName === undefined) {
    songName = 'What\'s my age again';
  }

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
     //empty array to hold data
     data = [];

     for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
  });
};

// Creating a function to get the tweets from twitter npm package
var getTweets = function() {
  var client = new twitter(keys.twitterKeys);

  var params = { screen_name: 'usmanjamil83', count: 10 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
          'created at: ' : tweets[i].created_at,
          'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
    }
  });
};
// Creating a function to get the movie info omdbapi using request npm package
var getMeMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
        'Title: ' : jsonData.Title,
        'Year: ' : jsonData.Year,
        'IMDB Rating: ' : jsonData.imdbRating,
        'Country: ' : jsonData.Country,
        'Language: ' : jsonData.Language,
        'Plot: ' : jsonData.Plot,
        'Actors: ' : jsonData.Actors,
        'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      });
      console.log(data);
    }
  });

};
// Creating a function to read the data from randon.txt and displaying ths result using using fs npm package
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    var dataArr = data.split(',');

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
    getTweets();
    break;
    case 'spotify-this-song':
    getMeSpotify(functionData);
    break;
    case 'movie-this':
    getMeMovie(functionData);
    break;
    case 'do-what-it-says':
    doWhatItSays();
    break;
    default:
    console.log('LIRI doesn\'t know that');
  }
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);