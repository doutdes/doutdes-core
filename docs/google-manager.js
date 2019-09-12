/**
 * @api {get} /ga/sessions/ Get WebSite sessions
 * @apiName Get WebSite Sessions
 * @apiGroup WebSite
 * @apiDescription This request returns the number of views to the website.
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {String} date Date of data collection
 * @apiSuccess (200) {String} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          [   "20190506",
 *              "27"
 *          ],
 *          [
 *              "20190507",
 *              "13"
 *          ],
 *          [
 *              "20190508",
 *              "24"
 *          ],
 *          [
 *              "20190509",
 *              "20"
 *          ]
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Google Analytics Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Google Analytics servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Google servers or with our database'
 *         }
 */

/**
 * @api {get} /ga/bouncerate/ Get WebSite bounce rate
 * @apiName Get WebSite bounce rate
 * @apiGroup WebSite
 * @apiDescription This request returns the bounce rate of the website.
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {String} date Date of data collection
 * @apiSuccess (200) {String} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          [   "20190506",
 *              "51.85185185185185"
 *          ],
 *          [
 *              "20190507",
 *              "61.53846153846154"
 *          ],
 *          [
 *              "20190508",
 *              "58.333333333333336"
 *          ],
 *          [
 *              "20190509",
 *              "75.0"
 *          ]
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Google Analytics Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Google Analytics servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Google servers or with our database'
 *         }
 */

/**
 * @api {get} /ga/avgSessionDuration/ Get average session duration
 * @apiName Get average session duration
 * @apiGroup WebSite
 * @apiDescription This request returns the average session duration of the website.
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {String} date Date of data collection
 * @apiSuccess (200) {String} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          [   "20190506",
 *              "32.0"
 *          ],
 *          [
 *              "20190507",
 *              "7.384615384615385"
 *          ],
 *          [
 *              "20190508",
 *              "10.833333333333334"
 *          ],
 *          [
 *              "20190509",
 *              "9.2"
 *          ]
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Google Analytics Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Google Analytics servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Google servers or with our database'
 *         }
 */

/**
 * @api {get} /ga/pageLoadTime/ Get WebSite page load time
 * @apiName Get webSite page load time
 * @apiGroup WebSite
 * @apiDescription This request returns the page load time of the website in ms.
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {String} date Date of data collection
 * @apiSuccess (200) {String} index Page address within the website
 * @apiSuccess (200) {String} value Value of the required metric
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          [   "20190506",
 *              "/",
 *              "317"
 *          ],
 *          [
 *              "20190507",
 *              "/"
 *              "503"
 *          ],
 *          [
 *              "20190508",
 *              "/preferences/"
 *              "621"
 *          ]
 *     ]
 * @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "name": 'Google Analytics Bad Request',
 *              "message": 'Invalid OAuth access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from Google Analytics servers
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "name": 'Internal Server Error',
 *              "message": 'There is a problem either with Google servers or with our database'
 *         }
 */

