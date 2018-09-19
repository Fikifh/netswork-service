const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/userController');
const PresentController = require('../../controllers/presentController');
const cutiController = require('../../controllers/cutiController');
const { authorize, ADMIN, LOGGED_USER } = require('../../../middleware/auth');
const {
  listPresent,
  addPresent,
  updatePresent,
} = require('../../validations/present.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('presentId', controller.load);


router
  .route('/')
  /**
   * @api {get} api/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListPresent
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [name]       User's name
   * @apiParam  {String}             [email]      User's email
   * @apiParam  {String=user,admin}  [role]       User's role
   *
   * @apiSuccess {Object[]} users List of users.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listPresent), controller.list);
  

router
  .route('/addPresent')
  /**
   * @api {post} api/users/addPresent User Present
   * @apiDescription post present user's
   * @apiVersion 1.0.0
   * @apiName UserPresent
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}   userId     Id's user
   * @apiParam  {String}   backlog   backlog's user
   * @apiParam  {String}   task      task's user
   * @apiParam  {String}   note      note's user
   *
   * @apiSuccess {String}  id         present's id
   * @apiSuccess {String}  email         user's id
   * @apiSuccess {String}  backlog    Backlog
   * @apiSuccess {String}  task       Task
   * @apiSuccess {String}  Note       Note
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .post(authorize(), PresentController.present);

router
  .route('/ajukanCuti')
  /**
   * @api {post} api/users/addPresent User Present
   * @apiDescription post present user's
   * @apiVersion 1.0.0
   * @apiName UserPresent
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}   email       email's user
   * @apiParam  {Date}     awal_cuti   awal cuti user
   * @apiParam  {Date}     akhir_cuti  akhir cuti user
   * @apiParam  {String}   keterangan  keterangan user
   *
   * @apiSuccess  {String}   email       email's user
   * @apiSuccess  {Date}   awal_cuti   awal cuti user
   * @apiSuccess  {Date}   akhir_cuti  akhir cuti user
   * @apiSuccess  {String}   keterangan  keterangan user
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
    .post(authorize(), cutiController.ajukan);

router
  .route('/mypresent/:idUser')
    .get(authorize(), function(){
      controller.myPresent;
    });

router
  .route('/:presentId')
  /**
   * @api {get} api/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {put} api/users/:id Replace User
   * @apiDescription Replace the whole user document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  
  .patch(authorize(LOGGED_USER), validate(updatePresent), controller.update)
  /**
   * @api {patch} api/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(), controller.remove);
  
  

module.exports = router;
