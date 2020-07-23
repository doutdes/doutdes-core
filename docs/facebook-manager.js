/**
 * @api {get} /fb/pages Get pages
 * @apiName Get pages
 * @apiGroup Facebook
 * @apiVersion 1.9.1
 * @apiDescription This request get all facebook pages associated to user's facebook token.
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
 *          "id": "page_id",
 *          },
 *          {
 *          "name": "page name",
 *          "id": "page_id",
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
 *          message: 'There is a problem either with Facebook servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/scopes Get scopes
 * @apiName Get scopes
 * @apiGroup Facebook
 * @apiVersion 1.9.1
 * @apiDescription This request get all facebook scopes associated to user's facebook token.
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
 *              [
 *                  "read_insights",
 *                  "pages_show_list",
 *                  "ads_read",
 *                  "business_management",
 *                  "pages_read_engagement",
 *                  "pages_manage_metadata",
 *                  "pages_read_user_content",
 *                  "pages_manage_ads",
 *                  "public_profile",
 *                  "manage_pages"
 *              ]
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
 *          message: 'There is a problem either with Facebook servers or with our database'
 *         }
 */

/**
 * @api {get} /fb/data Get data
 * @apiName Get data
 * @apiGroup Facebook
 * @apiVersion 1.9.1
 * @apiDescription This request get data given a metric and page id (fb token required on DB)
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
 *              message: 'You have not provided a page ID for the Facebook data request.'
 *          }
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              error: true,
 *              message: 'You have not provided a metric for the Facebook data request.'
 *          }
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
 * @apiError (500) InternalServerError Cannot get the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *          name: 'Internal Server Error',
 *          message: 'There is a problem either with Facebook servers or with our database'
 *         }
 */