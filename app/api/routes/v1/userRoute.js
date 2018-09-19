const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/userController');
const PresentController = require('../../controllers/presentController');
const cutiController = require('../../controllers/cutiController');
const { authorize, ADMIN, LOGGED_USER } = require('../../../middleware/auth');
const {
  listUsers,
  createUser,
  replaceUser,
  updateUser,
} = require('../../validations/user.validation');
const multer = require('multer');
const User = require('../../models/userModel');

const router = express.Router();
const storages = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads/images')
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString()+file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storages,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);


router
  .route('/')
  /**
   * @api {get} api/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
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
  .get(authorize(ADMIN), validate(listUsers), controller.list)
  /**
   * @api {post} api/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize(ADMIN), validate(createUser), controller.create);

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
   * @apiParam  {String}   email     email's user
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
  .route('/avatar/:id')
    .put(authorize(LOGGED_USER), upload.single('image'),controller.uploadImageProfil)
    .get(controller.avatar);    
router
  .route('/profile')
  /**
   * @api {get} api/users/profile User PRofile
   * @apiDescription Get logged in user profile information
   * @apiVersion 1.0.0
   * @apiName UserProfile
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
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .get(authorize(), controller.loggedIn);


router
  .route('/:userId')
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
  .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
  /**
   * @api {patch} api/users/:id Update User
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}             email         User's email
   * @apiParam  {String{6..128}}     password      User's password
   * @apiParam  {String{..128}}      nama          User's name
   * @apiParam  {String{..128}}      posisi        User's position
   * @apiParam  {String{..128}}      tanggalLahir  User's hire date
   * @apiParam  {String{..128}}      noHp          User's phone number
   * @apiParam  {String{..128}}      [gaji]        User's salary
   * @apiParam  {String=user,admin}  [role]        User's role
   * (You must be an admin to change the user's role or salary)
   *
   * @apiSuccess {String}  id           User's id
   * @apiSuccess {String}  name         User's name
   * @apiSuccess {String}  email        User's email
   * @apiSuccess {String}  posisi       User's position
   * @apiSuccess {String}  tanggalLahir User's hire date
   * @apiSuccess {String}  noHp         User's noHp
   * @apiSuccess {String}  gaji         User's salary
   * @apiSuccess {String}  role         User's role
   * @apiSuccess {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .patch(authorize(LOGGED_USER), validate(updateUser), controller.update)
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
  

router
.route('/api/photo')
  .put(controller.uploadFotoProfil);
  

module.exports = router;
