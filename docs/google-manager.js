/**
 * @api {get} /ga/data Get data
 * @apiName Get data
 * @apiGroup Google Analytics
 * @apiVersion 1.9.1
 * @apiDescription This request get data given some parameters and view id (ga token required on DB)
 *
 *
 * @apiParam {String} view_id Identifier of the view.
 * @apiParam {String} metric Identifier of the page.
 * @apiParam {String} dimension Identifier of the page.
 * @apiParam {String} sort Identifier of the page.
 * @apiParam {String} filter Identifier of the page.
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
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              error: true,
 *              message: 'You have not provided a view ID for the Google Analytics data request.'
 *          }
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: Google Analytics Bad Request,
 *              message: 'Invalid access token.'
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
 *          message: 'There is a problem either with Google servers or with our database'
 *         }
 */

/**
 * @api {get} /ga/scopes Get scopes
 * @apiName Get scopes
 * @apiGroup Google Analytics
 * @apiVersion 1.9.1
 * @apiDescription This request get all google analytics scopes associated to user's token.
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
 *          scopes:
 *              {
 *                  "azp": "",
 *                  "aud": "",
 *                  "sub": "",
 *                  "scope": "",
 *                  "exp": "",
 *                  "expires_in": "",
 *                  "email": "",
 *                  "email_verified": "",
 *                  "access_type": ""
 *              }
 *      }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: 'Token not available',
 *              message: 'Before get the scopes of the Google token, you should provide an access token instead.'
 *          }
 *
 **  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              name: 'Google Analytics Bad Request',
 *              message: 'Invalid access token.'
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
 *          message: 'There is a problem either with Google servers or with our database'
 *         }
 */

/**
 * @api {get} /ga/pages Get View List
 * @apiName Get View List
 * @apiGroup Google Analytics
 * @apiVersion 1.9.1
 * @apiDescription This request get all views associated to user's google analytics token.
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
 *          "id": "view_id",
 *          "name": "website domain",
 *          },
 *          {
 *          "id": "view_id",
 *          "name": "website domain",
 *          }
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
 *          message: 'There is a problem either with Google servers or with our database'
 *         }
 */

