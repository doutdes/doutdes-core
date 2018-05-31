/**
 * Classe per la gestione delle chiamate API da Facebook Insight
 * */

const request = require('request-promise');

class Facebook_Manager{
    static fbsearch(){
        const queryTerm     = 'Fiat';
        const searchType    = 'page';
        const userFieldSet  = 'name, link, is_verified, picture';
        const pageFieldSet  = 'name, category, link, picture, is_verified';

        const options = {
            method  : 'GET',
            uri     : 'https://graph.facebook.com/search',
            qs      : {
                access_token    : 'EAACEdEose0cBAAY8WNZB0odMIbFVF4J7cBLsjIrMiYF9iSKajFo5FMlRhgk0vUnnd8le6ZBCYTnzKP6pqwTRrdVP3O7zpiRfYwZBL5OP8QdZAoGKXQrZBGZCZBFuhZCOyI1WYOVXrW1ZBCphjKiTR2zixtNl82MQxyjrCZClSk3yUwLnaZCMls05U81aYhb7x6QK81j3ZCyqkZC1wCwZDZD',
                q               : queryTerm,
                type            : searchType,
                fields          : searchType === 'page' ? pageFieldSet : userFieldSet
            }
        };

        return request(options);
    }

    static fbpageInfo(){
        const options = {
            method  : 'GET',
            uri     : 'https://graph.facebook.com/820882001277849',
            qs      : {
                access_token    : 'EAAFTQBkK0B8BALsnr79Q6br5KZAd4XUD97ZBq1JwwHrngs1KRT7Segiyc85ZCQ4xRuNWFNRHkoKIEkwoXtYzki3DJ07NvUYhWndc66c2LvwoWKjzWMjwBltW7CZBB4jGZBd7MUuZBxZAROZAZB7104SOZCRZAQHOp3SdV8ZD'
            }
        };

        return request(options);
    };

}

module.exports.Facebook_Manager = Facebook_Manager;