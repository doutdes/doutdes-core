/**
 * @api {get} /dashboards/getAllUserDashboards/ Get all by user
 * @apiName Get Dashboards
 * @apiDescription This request takes all the dashboards owned by the user who made the call.
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Object[]} dashboards List of dashboards.
 * @apiSuccess (200) {Number} dashboards.dashboard_id Identifier of the dashboard.
 * @apiSuccess (200) {Number} dashboards.user_id ID of the user who owns the dashboard.
 * @apiSuccess (200) {Object} dashboards.Dashboard Details about the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.id  ID of the dashboard.
 * @apiSuccess (200) {String} dashboards.Dashboard.name Name of the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.category Number that identifies the type of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "user_id": 249,
 *              "dashboard_id": 249,
 *              "Dashboard": {
 *                  "id": 229,
 *                  "name": "Facebook",
 *                  "category": 1,
 *              }
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
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 */

/**
 * @api {get} /dashboards/getDashboardByType/:type Get By Type
 * @apiName Get Dashboards By Type
 * @apiDescription This request takes a single dashboard owned by a user, given its type
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Number} dashboard_id Identifier of the dashboard.
 * @apiSuccess (200) {Number} user_id ID of the user who owns the dashboard.
 * @apiSuccess (200) {Object} Dashboard Details about the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.id  ID of the dashboard.
 * @apiSuccess (200) {String} dashboards.Dashboard.name Name of the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.category Number that identifies the type of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "user_id": 249,
 *          "dashboard_id": 249,
 *          "Dashboard": {
 *              "id": 229,
 *              "name": "Facebook",
 *              "cateogry": 1,
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
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 */

/**
 * @api {get} /dashboards/getDashboardByID/:id Get By ID
 * @apiName Get Dashboards By ID
 * @apiDescription returns all the charts assigned to a chosen dashboard of the user who makes the call
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Number} chart_id Identifier of the chart.
 * @apiSuccess (200) {Object} Dashboard Details about the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.id  ID of the dashboard.
 * @apiSuccess (200) {String} originalTitle Default chart label.
 * @apiSuccess (200) {String} title Actual chart label.
 * @apiSuccess (200) {Number} type Identifier of the Analytics service of the chart
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *       "chart_id": 4,
 *       "format": "linea",
 *       "originalTitle": "Visualizzazioni",
 *       "title": "Visualizzazioni",
 *       "type": 2
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
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 */

/**
 * @api {get} /dashboards/getChart/:dashboard_id/:chart_id Read Chart
 * @apiName Read Chart
 * @apiDescription Given dashboard ID and chart ID it returns the corresponding chart
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Number} dashboard_id  Identification number of the dashboard
 * @apiSuccess (200) {Number} chart_id about Identification number of the chart
 * @apiSuccess (200) {String} title  Chart label
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         "dashboard_id": 3,
 *         "chart_id": 1,
 *         "title": "Fan per giorno"
 *      }
 *
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiError (400) {NoType} noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *         "updated": false,
 *         "chart_id": 12,
 *         "dashboard_id": 10,
 *         "error": "Cannot update a chart of the selected dashboard: dashboard that doesn't exists or is forbidden."
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 **/

/**
 * @api {get} /dashboards/getChartsNotAddedByDashboard/:dashboard_id/ Read Not Added By Dashboard
 * @apiName Read Not Added By Dashboard
 * @apiDescription Returns not added charts for the custom dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Number} ID  Identification number of the chart
 * @apiSuccess (200) {String} Title Chart title
 * @apiSuccess (200) {String} format Chart format (pie, column...)
 * @apiSuccess (200) {Number} type Identification number of the analytics social
 * @apiSuccess (200) {String} description Description of the chart
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *         "ID": 1,
 *         "Title": "Fan per giorno",
 *         "format": "linea",
 *         "Type": 1,
 *          "description": "Mostra il numero totale giornaliero dei fan della pagina"
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
 **/

/**
 * @api {get} /dashboards/getChartsNotAddedByDashboardAndType/:dashboard_id/:type/ Get Charts Not Added By Dashboard Id and Type
 * @apiName Get Charts Not Added By Dashboard Id and Type
 * @apiDescription This request returns the charts not added yet into the dashboard, given a dashboard id and its type
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Object[]} Charts Array of charts not added yet.
 * @apiSuccess (200) {Number} Charts.id ID of the chart.
 * @apiSuccess (200) {String} Charts.title Title of the chart.
 * @apiSuccess (200) {Number} Charts.type Type of the chart.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "ID": 249,
 *              "title": "Page Impressions",
 *              "type": 1
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
 * @apiError (500) InternalServerError Cannot get charts not added information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get charts not added information"
 *      }
 */

/**
 * @api {post} /dashboards/addChartToDashboard/ Add Chart to Dashboard
 * @apiName Add Charts to Dashboard
 * @apiDescription This request adds a chart to a dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} chart_id ID of the chart.
 * @apiParam {Number} dashboard_id ID of the dashboard
 * @apiParam {String} format Chart format
 * @apiParam {String} title Title of the chart.
 * @apiParam {Number} type Type of the chart.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              created: true,
 *              dashboard_id: 50,
 *              chart_id: 10
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *         inserted: false,
 *         chart_id: 50,
 *         error: 'Cannot insert a chart in a dashboard that doesn't exists or that you doesn't own'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot insert the chart into the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *              inserted: false,
 *              chart_id: 50,
 *              error: 'Cannot insert the chart into the dashboard'
 *      }
 */

/**
 * @api {delete} /dashboards/removeChartFromDashboard/ Remove Chart from Dashboard
 * @apiName Remove a chart from a Dashboard
 * @apiDescription This request removes a chart from a dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} chart_id ID of the chart.
 * @apiParam {Number} dashboard_id ID of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              deleted: true,
 *              dashboard_id: 50,
 *              chart_id: 10
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *          deleted: false,
 *          dashboard_id: 50,
 *          chart_id: 20,
 *          error: 'Cannot delete a chart that doesn't exists'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot remove the chart from the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          deleted: false,
 *          dashboard_id: 50,
 *          chart_id: 20,
 *          error: 'Cannot delete the chart from the dashboard'
 *      }
 */

/**
 * @api {put} /dashboards/updateChartInDashboard/ Update Chart in Dashboard
 * @apiName Update chart from a Dashboard
 * @apiDescription This request updates a chart holded by a dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} chart_id ID of the chart.
 * @apiParam {Number} dashboard_id ID of the dashboard
 * @apiParam {String} format Chart format
 * @apiParam {String} title Title of the chart.
 * @apiParam {Number} type Type of the chart.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              updated: true,
 *              dashboard_id: 50,
 *              chart_id: 10
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *          updated: false,
 *          dashboard_id: 50,
 *          chart_id: 20,
 *          error: 'Cannot update a chart that doesn't exists'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot remove the chart from the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          updated: false,
 *          dashboard_id: 50,
 *          chart_id: 20,
 *          error: 'Cannot update the chart from the dashboard'
 *      }
 */

/**
 * @api {delete} /dashboards/clearDashboard/ Clear Dashboard
 * @apiName Clear Dashboard
 * @apiDescription This request removes all charts from a dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} dashboard_id ID of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              clear: true,
 *              dashboard_id: 50,
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *          clear: false,
 *          dashboard_id: 50,
 *          error: 'Cannot delete charts or a dashboard that doesn't exists'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot remove the chart from the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          clear: false,
 *          dashboard_id: 50,
 *          error: 'Cannot delete charts or a dashboard that doesn't exists'
 *      }
 */

/**
 * @api {delete} /dashboards/deleteUserDashboard/ Remove Dashboard from a user
 * @apiName Remove Dashboard from a user
 * @apiDescription This request removes a dashboard from a user
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} dashboard_id ID of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              deleted: true,
 *              user_id: 2
 *              dashboard_id: 50
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *              deleted: false,
 *              user_id: 2
 *              dashboard_id: 50,
 *              message: 'Cannot delete the dashboard'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot remove the chart from the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *              deleted: false,
 *              user_id: 2
 *              dashboard_id: 50,
 *              message: 'Cannot delete the dashboard'
 *      }
 */

/**
 * @api {delete} /dashboards/deleteDashboard/ Remove Dashboard
 * @apiName Remove Dashboard
 * @apiDescription This request removes a dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {Number} dashboard_id ID of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              deleted: true,
 *              dashboard_id: 50
 *          }
 *     ]
 *
 @apiError (400) noParameters BAD REQUEST
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 OK
 *     {
 *              deleted: false,
 *              dashboard_id: 50,
 *              message: 'Cannot delete the dashboard'
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot remove the chart from the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *              deleted: false,
 *              dashboard_id: 50,
 *              message: 'Cannot delete the dashboard'
 *      }
 */

/**
 * @api {post} /dashboards/createDashboard/ Create Dashboard
 * @apiName Create Dashboard
 * @apiDescription This request create a new dashboard
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} name Name of dashboard
 * @apiParam {Number} category Category of the dashboard.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              created: true,
 *              dashboard_id: 50,
 *              name: 'Facebook'
 *              category: '1',
 *              message: 'The new dashboard has been created.'
 *          }
 *     ]
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot insert the chart into the dashboard
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *         created: false,
 *         name: 'Facebook',
 *         category: 10,
 *         message: 'Cannot create the dashboard.'
 *      }
 */

