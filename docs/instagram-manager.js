/**
 * @api {get} /ig/pages Get Pages List
 * @apiName Get Pages List
 * @apiGroup Instagram
 * @apiVersion 1.9.1
 * @apiDescription This request get all Instagram pages associated to user's facebook token.
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          {
 *          "id": "page_id",
 *          "username": "page username",
 *          "name": "page name",
 *          },
 *          {
 *          "id": "page_id",
 *          "username": "page username",
 *          "name": "page name",
 *          }
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Instagram servers or with our database'
 *         }
 */

/**
 * @api {get} /ig/businessInfo Get business info
 * @apiName Get business info
 * @apiGroup Instagram
 * @apiVersion 1.9.1
 * @apiDescription This request get business info about the page in parameter.
 *
 * @apiParam {String} page_id Identifier of Instagram Page
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          {
 *          "followers_count": Number,
 *          "media_count": Number,
 *          "id": "page_id",
 *          "end_date": "date"
 *          }
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Instagram servers or with our database'
 *         }
 */

/**
 * @api {get} /ig/data Get data
 * @apiName Get data
 * @apiGroup Instagram
 * @apiVersion 1.9.1
 * @apiDescription This request get data given some parameters and page id (fb token required on DB)
 *
 * @apiParam {String} page_id Identifier of Instagram Page
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} metric kind of data required.
 * @apiParam {String} page_id Identifier of the page.
 * @apiParam {String} period The aggregation period.
 * @apiParam {String} interval Range of days required.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           data:
 *              [
 *                  {
 *                  "value": []
 *                  "end_time" : date
 *                  },
 *                  {
 *                  "value": []
 *                  "end_time" : date
 *                  }
 *              ]
 *      }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              error: true,
 *              message: 'You have not provided a page ID for the Instagram data request.'
 *          }
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              error: true,
 *              message: 'You have not provided a metric for the Instagram data request.'
 *          }
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              error: true,
 *              message: 'You have not provided a period for the Instagram data request.'
 *          }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: 'Instagram Bad Request',
 *              message: 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Instagram servers or with our database'
 *         }
 */