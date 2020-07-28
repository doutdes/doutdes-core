/**
 * @api {get} /calendar/getEvents/ Get all by user
 * @apiName Get Events
 * @apiDescription This request takes all the event owned by the user who made the call.
 * @apiGroup Calendar
 * @apiVersion 1.9.1
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Object[]} events List of events.
 * @apiSuccess (200) {Number} events.id Identifier of the event.
 * @apiSuccess (200) {Number} events.user_id ID of the user who owns the event.
 * @apiSuccess (200) {String} events.title Title of the event.
 * @apiSuccess (200) {Data} events.dataStart Data when the event starts.
 * @apiSuccess (200) {Data} events.dataEnd Data when the event ends.
 * @apiSuccess (200) {String} events.primaryColor First color to indicate the event in the calendar.
 * @apiSuccess (200) {String} events.secondaryColor Second color to indicate the event in the calendar.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "id": 2,
 *              "user_id": 249,
 *              "title": "Take the milk",
 *              "dataStart": "2018-10-18T12:21:04.000Z",
 *              "dataEnd": "2018-10-18T20:00:00.000Z",
 *              "primaryColor": "#ababab",
 *              "secondaryColor": "#ececec",
 *          }
 *     ]
 *
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get events information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get events information"
 *      }
 */

/**
 * @api {post} /calendar/addEvent/ Add new event
 * @apiName Add new event
 * @apiDescription This request creates a new event for the user who made the call.
 * @apiGroup Calendar
 * @apiVersion 1.9.1
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} title Title of the event.
 * @apiParam {Data} dataStart Data when the event starts.
 * @apiParam {Data} dataEnd Data when the event ends.
 * @apiParam {String} primaryColor First color to indicate the event in the calendar.
 * @apiParam {String} secondaryColor Second color to indicate the event in the calendar.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *          "created": true,
 *          "id": 249,
 *          "title": "Take the milk",
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot insert the new event
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "created": false,
 *          "title": "Take the milk",
 *          "error": "Cannot insert the new event"
 *      }
 */

/**
 * @api {update} /calendar/updateEvent/ Update
 * @apiName Update
 * @apiDescription This request updates the choosen event owned by the user who made the call.
 * @apiGroup Calendar
 * @apiVersion 1.9.1
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} id Identifier of the event.
 * @apiParam {String} title Title of the event.
 * @apiParam {Data} dataStart Data when the event starts.
 * @apiParam {Data} dataEnd Data when the event ends.
 * @apiParam {String} primaryColor First color to indicate the event in the calendar.
 * @apiParam {String} secondaryColor Second color to indicate the event in the calendar.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *          "updated": true,
 *          "id": 249,
 *          "title": "Take the milk",
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot insert the new event
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "updated": false,
 *          "id": 249,
 *          "error": "Cannot update the event"
 *      }
 */

/**
 * @api {delete} /calendar/updateEvent/ Delete
 * @apiName Delete
 * @apiDescription This request deletes the event choosen by the user who both owns it and made the call.
 * @apiGroup Calendar
 * @apiVersion 1.9.1
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} id Identifier of the event.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *       {
 *          "deleted": true,
 *          "id": 249,
 *      }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot insert the new event
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "deleted": false,
 *          "id": 249,
 *          "error": "Cannot delete the event"
 *      }
 */