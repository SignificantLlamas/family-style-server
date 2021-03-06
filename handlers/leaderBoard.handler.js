var client = require('../config/redis.js');
var Promise = require('bluebird');

exports.leaderBoard = function getLeaderBoard(req, res) {
  client.zrevrangeAsync(['leaderboard', 0, 9])
  .then(function grabLeaderBoard(leaderBoard) {
    return Promise.all(leaderBoard.map(function mapYelpIds(yelpId) {
      return Promise.all([client.hgetallAsync(yelpId),
        client.zscoreAsync(['leaderboard', yelpId])]);
    }));
  })
  .then(function sendLeaderBoard(leaderBoard) {
    res.status(200).json(leaderBoard);
  })
  .catch(function leaderBoardError(error) {
    res.status(404).json({ error: error.message });
  });
};
