/**
 * @api {get} /fb/:channel/views/ Get views
 * @apiName Get views
 * @apiGroup YouTube
 * @apiDescription This request returns the total number of wiews of the channel
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} channel User channel ID
 *
 * @apiSuccess (200) {Date} date Date of data collection
 * @apiSuccess (200) {Number} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "date": "2019-05-07T00:00:00.000Z",
 *                      "value": 1
 *          },
 *          {
 *                      "date": "2019-05-08T00:00:00.000Z",
 *                      "value": 5
 *          },
 *          {
 *                      "date": "2019-05-09T00:00:00.000Z",
 *                      "value": 2
 *          },
 *          {
 *                      "date": "2019-05-10T00:00:00.000Z",
 *                      "value": 8
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'YouTube Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from YouTube servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with YouTube servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:channel/likes/ Get likes
 * @apiName Get likes
 * @apiGroup YouTube
 * @apiDescription This request returns the number of channel likes per day
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} channel User channel ID
 *
 * @apiSuccess (200) {Date} date Date of data collection
 * @apiSuccess (200) {Number} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "date": "2019-05-07T00:00:00.000Z",
 *                      "value": 2
 *          },
 *          {
 *                      "date": "2019-05-08T00:00:00.000Z",
 *                      "value": 6
 *          },
 *          {
 *                      "date": "2019-05-09T00:00:00.000Z",
 *                      "value": 7
 *          },
 *          {
 *                      "date": "2019-05-10T00:00:00.000Z",
 *                      "value": 10
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'YouTube Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from YouTube servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with YouTube servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:channel/dislikes/ Get dislikes
 * @apiName Get dislikes
 * @apiGroup YouTube
 * @apiDescription This request returns the number of channel dislikes per day
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} channel User channel ID
 *
 * @apiSuccess (200) {Date} date Date of data collection
 * @apiSuccess (200) {Number} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "date": "2019-05-07T00:00:00.000Z",
 *                      "value": 1
 *          },
 *          {
 *                      "date": "2019-05-08T00:00:00.000Z",
 *                      "value": 3
 *          },
 *          {
 *                      "date": "2019-05-09T00:00:00.000Z",
 *                      "value": 2
 *          },
 *          {
 *                      "date": "2019-05-10T00:00:00.000Z",
 *                      "value": 1
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'YouTube Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from YouTube servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with YouTube servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:channel/avgView/ Get average view time
 * @apiName Get average view time
 * @apiGroup YouTube
 * @apiDescription This request returns the average viewing time of the channel's videos (in seconds)
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} channel User channel ID
 *
 * @apiSuccess (200) {Date} date Date of data collection
 * @apiSuccess (200) {Number} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *                      "date": "2019-05-07T00:00:00.000Z",
 *                      "value": 8
 *          },
 *          {
 *                      "date": "2019-05-08T00:00:00.000Z",
 *                      "value": 31
 *          },
 *          {
 *                      "date": "2019-05-09T00:00:00.000Z",
 *                      "value": 105
 *          },
 *          {
 *                      "date": "2019-05-10T00:00:00.000Z",
 *                      "value": 50
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'YouTube Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from YouTube servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with YouTube servers or with our database'
 *         }
 */