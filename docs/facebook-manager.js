/**
 * @api {get} /fb/:page_id/fancount/ Get fan count
 * @apiName Get fan count
 * @apiGroup Facebook
 * @apiDescription This request returns the number of fans of the page inserted as a parameter.
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
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "value": 518,
 *              "end_time": "2019-05-06T07:00:00+0000"
 *          },
 *          {
 *              "value": 519,
 *              "end_time": "2019-05-07T07:00:00+0000"
 *          },
 *          {
 *              "value": 522,
 *              "end_time": "2019-05-08T07:00:00+0000"
 *          },
 *          {
 *              "value": 525,
 *              "end_time": "2019-05-09T07:00:00+0000"
 *              }
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Facebook Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Facebook
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Facebook servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/:page_id/engageduser/ Get engaged user
 * @apiName Get Dashboards
 * @apiGroup Facebook
 * @apiDescription This request returns the total number of people who have interacted with the page (interaction means any click)
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
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "value": 5,
 *              "end_time": "2019-05-06T07:00:00+0000"
 *          },
 *          {
 *              "value": 3,
 *              "end_time": "2019-05-07T07:00:00+0000"
 *          },
 *          {
 *              "value": 2,
 *              "end_time": "2019-05-08T07:00:00+0000"
 *          },
 *          {
 *              "value": 10,
 *              "end_time": "2019-05-09T07:00:00+0000"
 *              }
 *          }
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Facebook Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Facebook
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Facebook servers or with our database'
 *         }
 */