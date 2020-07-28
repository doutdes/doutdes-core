/**
 * @api {get} /yt/data Get data
 * @apiName Get data
 * @apiGroup Youtube
 * @apiVersion 1.9.1
 * @apiDescription This request get data given some parameters and view id (ga token required on DB)
 *
 *
 * @apiParam {String} view_id Identifier of the view.
 * @apiParam {String} metric kind of data required.
 * @apiParam {String} dimensions data attributes.
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
 *              [
 *                  [
 *                  "date"
 *                  "values"
 *                  ],
 *                  [
 *                  "date"
 *                  "values"
 *                  ]
 *              ]
 *      }
 *
 ** @apiError (400) noParameters Bad Request
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: Youtube Bad Request,
 *              message: 'Invalid access token.'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get data
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Youtube servers or with our database'
 *         }
 */

/**
 * @api {get} /yt/channels Get channels
 * @apiName Get channels
 * @apiGroup Youtube
 * @apiVersion 1.9.1
 * @apiDescription This request get all youtube channels associated to user's google analytics token.
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
 *          "id": "channel_id",
 *          "name": "channel name"
 *          }
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get data
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Youtube servers or with our database'
 *         }
 */
