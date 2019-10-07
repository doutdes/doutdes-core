/** YOUTUBE API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');
const DateFns = require('date-fns');

/** CONSTANTS **/
const config = require('../config/config').production;
const DAYS = {
  yesterday: 1,
  min_date: 90
};

/** ENDPOINTS **/
const dataEndPoint = 'https://www.googleapis.com/youtube/v3';
const analyticsEndPoint = 'https://youtubeanalytics.googleapis.com/v2/reports';
const tokenEndPoint = 'https://www.googleapis.com/oauth2/v4/token';

// Given a refresh token, it retrieves the access token
const getAccessToken = async (refreshToken) => {
  let result;

  const options = {
    method: 'POST',
    uri: tokenEndPoint,
    qs: {
      client_id: config.ga_client_id,
      client_secret: config.ga_client_secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }
  };

  try {
    result = JSON.parse(await Request(options));
    return result['access_token'];
  } catch (e) {
    console.error(e);
  }
};

// It retrieves the list of the channels
const getChannels = async (refresh_token) => {
  const access_token = await getAccessToken(refresh_token);
  const endPoint = `${dataEndPoint}/channels`;
  const params = {part: 'snippet,id'};

  const result = await youtubeQuery(access_token, endPoint, params);

  return result.items.map(item => {
    return {id: item.id, title: item.snippet.title, thumbnails: item.snippet.thumbnails}
  });
};

// Main data request: requires a refresh token and the params for the call request
const yt_getData = async (refreshToken, queryParams) => {
  const {endPoint, params} = getParams(queryParams.metric, queryParams.channel_id);
  const token =  await getAccessToken(refreshToken);

  return (await youtubeQuery(token, endPoint, params));
};

// Generic Youtube query
const youtubeQuery = async (token, endPoint, params) => {
  const options = {
    method: 'GET',
    uri: endPoint,
    qs: {
      ...params,
      access_token: token,
    },
    json: true
  };

  try {
    return (await Request(options));
  } catch (err) {
    console.error(err);
    throw new Error('youtubeQuery -> Error during the YouTube query -> ' + err['message']);
  }
};

// This method handle some critical cases (different endpoint, different params, ecc)
const getParams = (metric, channelId) => {
  let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date)).toISOString().slice(0, 10);
  let end_date = (DateFns.subDays(new Date(), DAYS.yesterday)).toISOString().slice(0, 10); // yesterday

  switch (metric) {
    case 'playlists':
      return {
        endPoint: `${dataEndPoint}/playlists`,
        params: {
          part: 'snippet',
          channelId: channelId
        }
      };
    case 'videos':
      return {
        endPoint: `${dataEndPoint}/search`,
        params: {
          part: 'snippet',
          type: 'video',
          metrics: 'videos',
          channelId: channelId,
          mine: 'true'
        }
      };
    case 'info':
      return {
        endPoint: `${dataEndPoint}/channels`,
        params: {
          part: 'statistics',
          id: channelId,
        }
      };
    default:
      return {
        endPoint: analyticsEndPoint,
        params: {
          channel: channelId,
          metrics: metric,
          dimensions: 'day',
          ids: `channel==MINE`,
          startDate: start_date,
          endDate: end_date,
          mine: true
        }
      };
  }

};

module.exports = {config, yt_getData, getChannels};
