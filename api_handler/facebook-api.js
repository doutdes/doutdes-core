/**
 * Classe per la gestione delle chiamate API da Facebook Insight
 * */

const Request = require('request-promise');

exports.fbFanCount = function () {

    const page_id = '1397642170275248';
    const access_token = 'EAACEdEose0cBANDe7CnAB2GwjTUGtydy3c3tr8WjuBOul3DuD5NAZBIqKg41F5QpiU5bViDgAs1w5CJ7qm2WHfdAXGroWgMRfnIOqjWxu8DJA7b0u3ZCczBeZACivWCNwK2KzQbn81zpGaQayhEJhYfllTR3w9k2VLr3wMiYXWgPIhZC2JAWsjZAqsmi3oM9bSyrzJhNoRgZDZD'
    const options = {
        method : 'GET',
        uri : 'https://graph.facebook.com/' + page_id,
        qs : {
            access_token : access_token,
            fields : 'fan_count'
        }
    };
    return Request(options);
};

