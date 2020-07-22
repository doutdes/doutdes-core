/**
 * @api {post} /keys/insert Insert key
 * @apiName Insert service key
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request insert a service tokens in DB
 *
 * @apiParam {Number} service_id Identifier of service category.
 * @apiParam {String} api_key token of the service.
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
 *      "created": true,
 *      "api_key": api_key
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": '*Service* token already exists',
 *          }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "created": false,
 *              "api_key": api_key
 *              "error": 'Cannot insert the key'
 *         }
 */

/**
 * @api {get} /keys/readAllKeysById Read all keys by ID
 * @apiName Read all keys by ID
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request read all tokens and pages given a user id
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
 *      "user_id": id,
 *      "fb_token": fb_token or null
 *      "ga_token": ga_token or null
 *      "ga_view_id": ga_view_id or null,
 *      "fb_page_id": fb_page_id or null,
 *      "fbm_page_id": fbm_page_id or null,
 *      "ig_page_id": ig_page_id or null
 *   }
 *
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": 'Cannot retrieve user tokens'
 *         }
 */

/**
 * @api {put} /keys/update Update token
 * @apiName Update token
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request update a token and page of a user
 *
 * @apiParam {Number} service_id Identifier of the service category.
 * @apiParam {String} api_key token of the service.
 * @apiParam {String} page_id Page id or view id of the service.
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
 *      "updated": true,
 *      "api_key": api_key
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "created": false,
 *              "error": 'Unrecognized service type.',
 *          }*
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": 'Cannot update the *Service* key'
 *         }
 */

/**
 * @api {delete} /keys/delete Delete token
 * @apiName Delete token
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request update a token and page of a user
 *
 * @apiParam {Number} service_id Identifier of the service category.
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
 *      "deleted": true,
 *      "message": '*Service* token deleted successfully'
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "created": false,
 *              "error": 'Unrecognized service type.',
 *          }*
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": 'Cannot delete the *Service* key'
 *         }
 */

/**
 * @api {get} /keys/checkIfExists/:type Check token existence
 * @apiName Check tokens existence
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request checks if there is a token for the chosen service
 *
 * @apiParam {Number} type Identifier of the service category.
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
 *      "exists": true,
 *      "service": type
 *   }
 *
 ** @apiError (400) noParameters Bad Request
 *
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *          {
 *              "error": true,
 *              "message": 'Cannot find a service of type' + type.
 *          }*
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": true,
 *              "message": "An error occurred while checking the existence of a token service."
 *         }
 */

/**
 * @api {get} /keys/isPermissionGranted/:type Check token permissions
 * @apiName Check tokens permissions
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request checks if the token has the permissions for the service
 *
 * @apiParam {Number} type Identifier of the service category.
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
 *      "name": "Service Name",
        "type": type,
        "granted": true,
        "tokenValid": true,
        "scopes": scopes
 *   }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": true,
 *              "message": "There is a problem with our servers."
 *         }
 */

/**
 * @api {delete} /keys/revokePermissions/:type Revoke token permissions
 * @apiName Revoke tokens permissions
 * @apiGroup Tokens
 * @apiVersion 1.9.1
 * @apiDescription This request revokes the permissions of the associated token
 *
 * @apiParam {Number} type Identifier of the service category.
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
            "revoked": true,
            "service": "Service name",
            "type": type
 *   }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get information from external services.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *         {
 *              "error": true,
 *              "message": "There is a problem with our servers."
 *         }
 */
