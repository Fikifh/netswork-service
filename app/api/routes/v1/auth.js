const express = require('express');
const validate =require('express-validation');
const controller = require('../../controllers/authController');
const oAuthLogin = require('../../../middleware/auth').oAuth;
const { login, register, oAuth, refresh,} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @api {post} api/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 * 
 * @apiParam {String}           email           User's email
 * @apiParam {String{6..128}}   password        User's Password
 * @apiParam {String}           nama            User's Nama
 * @apiParam {String}           posisi          User's Position
 * @apiParam {Date}             tanggalLahir    User's Hire Date
 * @apiParam {String}           noHp            User's Handphone Number
 * @apiParam {String}           level           User's Level
 * @apiParam {Number}           gaji            User's Salary
 * 
 * @apiSuccess (Created 201) {String}   token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}   token.accessToken   Authorization Token 
 * @apiSuccess (Created 201) {String}   token.refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess (Created 201) {Number}   token.expiresIn     Access Token expiration time in miliseconds
 * @apiSuccess (Created 201) {String}   token.timezone      The server's Timezone
 * 
 * @apiSuccess (Created 201) {String}   user.id         User's id
 * @SpiSuccess (Created 201) {String}   user.name       User's name
 * @apiSuccess (Created 201) {String}   user.email      User's email
 * @apiSuccess (Created 201) {String}   user.role       User's role  
 * @apiSuccess (Created 201) {String}   user.createdAt  Timestamp
 * 
 * @apiError (Bad Request 400) Validator some parameters may contain invalid values
 */
router.route('/register').post(validate(register), controller.register);

/**
 * @api {post} api/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 * 
 * @apiParam {String}           email       User's email
 * @apiParam {String{..128}}    password    User's password
 * 
 * @apiSuccess {String}     token.tokenType     Access Token's type
 * @apiSuccess {String}     token.accessToken   Authorization Token
 * @apiSuccess {String}     token.refreshToken  Token to get a new accressToken after expiration time
 * @apiSuccess {Number}     token.expireIn      Access Token's expiration time in miliseconds
 * 
 * @apiSuccess {String}     user.id         User's id
 * @apiSuccess {String}     user.name       User's name
 * @apiSuccess {String}     user.email      User's email
 * @apiSuccess {String}     user.role       User's role
 * @apiSuccess {Date}       user.createdAt  Timestamp
 * 
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized in correct email or password
 */
router.route('/login').post(validate(login), controller.login);

/**
 * @api {post} api/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router.route('/refresh-token')
  .post(validate(refresh), controller.refresh);


/**
 * TODO: POST /api/auth/reset-password
 */


/**
 * @api {post} api/auth/refresh-token Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), controller.oAuth);

/**
 * @api {post} api/auth/refresh-token Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), controller.oAuth);


module.exports = router;