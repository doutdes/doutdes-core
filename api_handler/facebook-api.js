/**
 * Classe per la gestione delle chiamate API da Facebook Insight
 * */

const request = require('request-promise');

exports.fbFanCount = function () {
    const page_id = '1397642170275248';
    const access_token = 'EAACEdEose0cBAKmSZAxFEvRt1TLXbRRWEWFZAzJZChOdXZC4V7tmpEELcyXVKfZAmyZBgpns3zpZBfCGbngC6wxpsl6a0Irazt2Akcohpttyn519HLz0dLsQmymImjcLoIlkBn3b5YMlDzJLM5ZBEQhsnjqkVZBc3RIW8NNevx3fWF35RHXE8lbFTLtFeAYRBPX0ZD'
    const options = {
        method : 'GET',
        uri : 'https://graph.facebook.com/' + page_id,
        qs : {
            access_token : access_token,
            fields : 'fan_count'
        }
    };
    return request(options);
};