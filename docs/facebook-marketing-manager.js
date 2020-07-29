/**
 * @api {get} /fbm/pages Get Pages List
 * @apiName Get Pages List
 * @apiGroup Facebook Marketing
 * @apiVersion 1.9.1
 * @apiDescription This request get all facebook marketing pages associated to user's facebook token.
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
 *          "name": "page name",
 *          "id": "act_id"
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
 *          message: 'There is a problem either with Facebook servers or with our database'
 *         }
 */

/**
 * @api {get} /fbm/data Get data
 * @apiName Get data
 * @apiGroup Facebook Marketing
 * @apiVersion 1.9.1
 * @apiDescription This request get data given some parameters (fb token required on DB)
 *
 * @apiParam {String} metric kind of data required.
 * @apiParam {String} page_id Identifier of the page.
 * @apiParam {String} breakdowns
 * @apiParam {String} domain
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
 *          data:
 *              [
 *                  {
 *                     "ctr": "0",
 *                     "date_start": "2020-06-10",
 *                     "date_stop": "2020-06-10",
 *                     "age": "13-17"
 *                  },
 *                  {
 *                      "ctr": "4.255319",
 *                      "date_start": "2020-06-10",
 *                      "date_stop": "2020-06-10",
 *                      "age": "18-24"
 *                  }
 *                  .
 *                  .
 *                  .
 *              ]
 *      }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: 'Facebook Bad Request',
 *              message: 'Invalid OAuth access token.'
 *          }
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
 *          message: 'There is a problem either with Facebook servers or with our database'
 *         }
 */