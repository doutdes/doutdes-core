/**
 * @api {post} /users/create/ Create
 *
 * @apiName Create new user
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
 *          "first_name": "Gianni",
 *          "last_name": "Sperti"
 *     }
 *
 * @apiError (400) UserAlreadyExists The username or the email has been alredy used.
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
 * @apiDescription The request gives to the user who made the call all his informaations.
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
 *          "first_name": "Michael",
 *          "last_name": "Bohn",
 *          "birth_place": "Land of Admins",
 *          "birth_date": "1990-06-06",
 *          "fiscal_code": "aaaddd93e92b292u",
 *          "address": "Admin street, 23",
 *          "province": "ad",
 *          "city": "administration",
 *          "zip": "01923",
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
 * @api {sendMail} /users/delete/ Delete
 *
 * @apiName Delete
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
 *          "username": "Gianni",
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

