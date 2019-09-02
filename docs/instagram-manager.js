/**
 * @api {get} /fb/:page_id/impressions/ Get impressions
 * @apiName Get impressions
 * @apiGroup Instagram
 * @apiDescription This request returns the total number of people who have seen any content associated with the page
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} page_id User page ID
 * @apiSuccess (200) {Number} value Value of the required metric
 * @apiSuccess (200) {Date} end_time Date of data collection
 * @apiSuccess (200) {String} metric metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "value": 3,
 *                      "end_time": "2019-08-05T07:00:00+0000",
 *                      "metric": "impressions"
 *          },
 *          {
 *                      "value": 5,
 *                      "end_time": "2019-08-06T07:00:00+0000",
 *                      "metric": "impressions"
 *          },
 *          {
 *                      "value": 2,
 *                      "end_time": "2019-08-07T07:00:00+0000",
 *                      "metric": "impressions"
 *          },
 *          {
 *                      "value": 7,
 *                      "end_time": "2019-08-08T07:00:00+0000",
 *                      "metric": "impressions"
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Instagram Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Instagram servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Instagram servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:page_id/reach/ Get reach
 * @apiName Get reach
 * @apiGroup Instagram
 * @apiDescription This request returns the total number of unique accounts that have sees the media of the page.
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} page_id User page ID
 * @apiSuccess (200) {Number} value Value of the required metric
 * @apiSuccess (200) {Date} end_time Date of data collection
 * @apiSuccess (200) {String} metric Metric required
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "value": 3,
 *                      "end_time": "2019-08-05T07:00:00+0000",
 *                      "metric": "reach"
 *          },
 *          {
 *                      "value": 0,
 *                      "end_time": "2019-08-06T07:00:00+0000",
 *                      "metric": "reach"
 *          },
 *          {
 *                      "value": 2,
 *                      "end_time": "2019-08-07T07:00:00+0000",
 *                      "metric": "reach"
 *          },
 *          {
 *                      "value": 1,
 *                      "end_time": "2019-08-08T07:00:00+0000",
 *                      "metric": "reach"
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Instagram Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Instagram servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Instagram servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:page_id/audcity/ Get followers by city
 * @apiName Get followers by city
 * @apiGroup Instagram
 * @apiDescription This request returns the number of followers divided by city
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} page_id User page ID
 * @apiSuccess (200) {Number} value Value of the required metric
 * @apiSuccess (200) {Date} end_time Date of data collection
 * @apiSuccess (200) {String} metric Metric required
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "value": {
 *                          "Cagliari": 2,
 *                          "Sassari": 5,
 *                          "Nuoro": 3,
 *                          "Oristano": 10
 *                      },
 *                      "end_time": "2019-08-05T07:00:00+0000",
 *                      "metric": "audience_city"
 *          },
 *          {
 *                      "value": {
 *                          "Cagliari": 6,
 *                          "Roma": 5,
 *                          "Nuoro": 3,
 *                          "Milano": 7
 *                      },
 *                      "end_time": "2019-08-06T07:00:00+0000",
 *                      "metric": "audience_city"
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Instagram Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Instagram servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Instagram servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:page_id/audgenderage/ Get followers by gender
 * @apiName Get followers by city
 * @apiGroup Instagram
 * @apiDescription This request returns the number of followers divided by gender
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} page_id User page ID
 * @apiSuccess (200) {Number} value Value of the required metric
 * @apiSuccess (200) {Date} end_time Date of data collection
 * @apiSuccess (200) {String} metric Metric required
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "value": {
 *                         "M18-24": 3,
 *                         "M25-34": 11,
 *                         "M13-17": 1,
 *                         "F18-24": 1
 *                      },
 *                      "end_time": "2019-08-05T07:00:00+0000",
 *                      "metric": "audience_gender_age"
 *          },
 *          {
 *                      "value": {
 *                         "M18-24": 5,
 *                         "M25-34": 7,
 *                         "M13-17": 1,
 *                         "F18-24": 9
 *                      },
 *                      "end_time": "2019-08-06T07:00:00+0000",
 *                      "metric": "audience_gender_age"
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Instagram Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Instagram servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Instagram servers or with our database'
 *         }
 */