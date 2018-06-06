/**
 * Classe per la gestione delle chiamate API da Facebook Insight
 * */

const request = require('request-promise');

exports.fbFanCount = function () {
    const page_id = '1397642170275248';
    const access_token = 'EAACEdEose0cBAC3HIVxbGozjePH8pqa3P4wgyPfVJSXztEt5x64p2nUmreoAIbAcZBlQTvkA1KA8ftz2PhUPlSchXYybVfegZC7MCqlu1ntPRYQVh0x9eZCUZCl8C73xcme42SXrNlZCs2xWy20EWuZCITz3klqmD7CeBXvoxSZBrtkTizHaOTvyLUWRXAnbl0tegY4BciZAawZDZD'
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

