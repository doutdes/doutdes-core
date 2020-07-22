/**
 * @api {post} /users/create/ Create
 *
 * @apiName Create new user
 * @apiVersion 1.9.1
 * @apiDescription The request create a new user
 * @apiGroup User
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} company_name Name of the company of the user.
 * @apiParam {String} vat_number Vat Number of the company of the user.
 * @apiParam {String} first_name First name of the user.
 * @apiParam {String} last_name Last name of the user.
 * @apiParam {String} birth_place Birth place of the user.
 * @apiParam {Date} birth_date Birth date of the user.
 * @apiParam {String} fiscal_code Fiscal code of the user.
 * @apiParam {String} address Address of residence of the user.
 * @apiParam {String} province Province of residence of the user.
 * @apiParam {String} city City of residence of the user.
 * @apiParam {String} zip Zip code associated to the city of residence of the user.
 * @apiParam {String} password Password needed by the user to login to the platform.
 * @apiParam {String} user_type Type of the user into the platform.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 CREATED
 *     {
 *          "created": true,
 *          "first_name": "Nome",
 *          "last_name": "Cognome"
 *     }
 *
 * @apiError (400) UserAlreadyExists The username or the email has been already used.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *          "created": false,
 *          "error": "Username or email already exists",
 *     }
 *
 * @apiError (500) InternalServerError Cannot create the new user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot create the new user"
 *          "username": "administrator"
 *      }
 */

/**
 * @api {get} /users/getFromId/ Get From ID
 * @apiName GetFromId
 * @apiVersion 1.9.1
 * @apiDescription The request gives to the user who made the call all his informations.
 * @apiGroup User
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 *
 * @apiSuccess {Number} id Identifier of the user.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {String} email Email of the user.
 * @apiSuccess {String} company_name Name of the company of the user.
 * @apiSuccess {String} vat_number Vat Number of the company of the user.
 * @apiSuccess {String} first_name First name of the user.
 * @apiSuccess {String} last_name Last name of the user.
 * @apiSuccess {String} birth_place Birth place of the user.
 * @apiSuccess {Date} birth_date Birth date of the user.
 * @apiSuccess {String} fiscal_code Fiscal code of the user.
 * @apiSuccess {String} address Address of residence of the user.
 * @apiSuccess {String} province Province of residence of the user.
 * @apiSuccess {String} city City of residence of the user.
 * @apiSuccess {String} zip Zip code associated to the city of residence of the user.
 * @apiSuccess {String} password Password needed by the user to login to the platform.
 * @apiSuccess {String} user_type Type of the user into the platform.
 * @apiSuccess {String} checksum Field for verify the fairness of the other fields.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "id": 2,
 *          "username": "admin",
 *          "email": "admin",
 *          "company_name": "myCompany",
 *          "vat_number": 123456789456,
 *          "first_name": "Nome",
 *          "last_name": "Cognome",
 *          "birth_place": "Cagliari",
 *          "birth_date": "1990-06-06",
 *          "fiscal_code": "aaaddd93e92b292u",
 *          "address": "via Ospedale, 72",
 *          "province": "Ca",
 *          "city": "Cagliari",
 *          "zip": "01924",
 *          "password": "a_password",
 *          "user_type": "his_user_type",
 *          "checksum": "a_nice_checksum"
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get the user informations
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot GET the user informations"
 *      }
 */

/**
 * @api {put} /users/update/ Update
 *
 * @apiName Update
 * @apiVersion 1.9.1
 * @apiDescription This request lets the user who made the call to update his informations.
 * @apiGroup User
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} company_name Name of the company of the user.
 * @apiParam {String} vat_number Vat Number of the company of the user.
 * @apiParam {String} first_name First name of the user.
 * @apiParam {String} last_name Last name of the user.
 * @apiParam {String} birth_place Birth place of the user.
 * @apiParam {Date} birth_date Birth date of the user.
 * @apiParam {String} fiscal_code Fiscal code of the user.
 * @apiParam {String} address Address of residence of the user.
 * @apiParam {String} province Province of residence of the user.
 * @apiParam {String} city City of residence of the user.
 * @apiParam {String} zip Zip code associated to the city of residence of the user.
 * @apiParam {String} password Password needed by the user to login to the platform.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "updated": true,
 *          "user_id": 258,
 *     }
 *
 * @apiError (500) InternalServerError Cannot update the user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "updated": false,
 *          "user_id": 249,
 *          "message": "Cannot update the user"
 *      }
 */

/**
 * @api {delete} /users/delete/ Delete
 *
 * @apiName Delete
 * @apiVersion 1.9.1
 * @apiDescription This request lets the admin to delete a user from the platform.
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} username Username of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "deleted": true,
 *          "username": "admin",
 *     }
 *
 * @apiError (500) InternalServerError Cannot delete the user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "deleted": false,
 *          "user": "Administrator",
 *          "message": "Cannot delete the user"
 *      }
 */

/**
 * @api {post} /login Login user
 * @apiName Login
 * @apiGroup Login
 * @apiSuccess {Number} id Identifier of the User.
 * @apiSuccess {String} username Username of the User.
 * @apiSuccess {String} email Email of the User.
 * @apiSuccess {String} first_name First Name of the User.
 * @apiSuccess {String} last_name Last Name of the User.
 * @apiSuccess {String} user_type Type of the User.
 *
 *  @apiParam {String} username username of user (required).
 *  @apiParam {String} password password of the user (required).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *  "user": {
 *       "id": 3,
 *       "username": "admin",
 *       "email": "email@email.com",
 *       "first_name": "Nome",
 *       "last_name": "Cognome",
 *       "user_type": "1"
 *       },
 *   "token": "vSE1L8ng-dVJaDlmnmi2JlbMvudkaIeDqvJ-zBjk0Uk"
 *   }
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          {
 *  "logged": false,
 *   "error": "unauthorized"
 *   }
 */


