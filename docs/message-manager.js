/**
 * @api {post} /message/createMessage Create message
 * @apiName Create message
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiDescription This request create a message.
 *
 * @apiParam {String} title Title of the message
 * @apiParam {String} text Text of the message
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
 *      "message": 'Message successfully created',
 *      "title": title,
 *      "text": text
 *   }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot create the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'Cannot create the new message'
 *         }
 */

/**
 * @api {get} /message/getMessageByID/:message_id Get Message by ID
 * @apiName Get Message by ID
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiDescription This request get a message by ID
 *
 * @apiParam {Number} message_id Identifier of the message.
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
 *      "id": message_id,
 *      "title": title,
 *      "text": text,
 *      "is_read": true or false
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": 'the message cannot be read from the user'
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
 *             "error": 'Cannot retrieve the message for the given id'
 *         }
 */

/**
 * @api {get} /message/getMessagesForUser Get messages from user
 * @apiName Get Messages from user
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiDescription This request get all messages assigned to the user
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
 *          "id": message_id,
 *          "title": title,
 *          "text": text,
 *          "is_read": true or false
 *          },
 *          {
 *          "id": message_id,
 *          "title": title,
 *          "text": text,
 *          "is_read": true or false
 *          }
 *      }
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
 * @apiError (500) InternalServerError Cannot get the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'Cannot retrieve the message for the given user'
 *         }
 */

/**
 * @api {post} /message/sendMessageToUser Send Message
 * @apiName Send Message
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiPermission admin
 * @apiDescription This request send a message (only for admins)
 *
 * @apiParam {Number} message_id Identifier of the message
 * @apiParam {Number} user_id Identifier of the receiver
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
 *          "message": 'Message sent successfully'
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": 'the message has been sent previously for the selected user'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot create the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'The message selected doesn\'t exists'
 *         }
 */

/**
 * @api {post} /message/setMessageRead Set message as read
 * @apiName Set message as read
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiDescription This request set message as read
 *
 * @apiParam {Number} message_id Identifier of the message
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
 *          "message": 'message set to read successfully'
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": 'the message cannot be read from the user or the message is read already'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot create the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'The message selected doesn\'t exists'
 *         }
 */

/**
 * @api {delete} /message/deleteMessageForUser/:message_id Delete message for user
 * @apiName Delete message for user
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiDescription This request delete a message associated to the user
 *
 * @apiParam {Number} message_id Identifier of the message
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
 *          "message": 'message deleted successfully'
 *   }
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": 'the message cannot be deleted from the user'
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot create the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'The message selected doesn\'t exists'
 *         }
 */

/**
 * @api {delete} /message/deleteMessageByID Delete message by ID
 * @apiName Delete message by ID
 * @apiGroup Messages
 * @apiVersion 1.9.1
 * @apiPermission admin
 * @apiDescription This request delete a message given a message id
 *
 * @apiParam {Number} message_id Identifier of the message
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
 *          "message": 'message deleted successfully'
 *   }
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot create the message
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *             "error": 'Cannot retrieve the message for the given id'
 *         }
 */

