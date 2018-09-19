const httpStatus = require('http-status');
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const moment = require('moment-timezone');
const {jwtExpirationInterval} = require('../../config/variables');

/**
 * return a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken){
    const tokenType = 'Bearer';
    const refreshToken = RefreshToken.generate(user).token;
    const expireIn = moment().add(jwtExpirationInterval, 'minutes');
    return{
        tokenType, accessToken, refreshToken, expireIn,
    };
}
/**
 * Return jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};
/**
 * Return jwt an existing user or creates a new one valid accessToken token
 * Return jwt token
 * @public
 */
exports.oAuth = async (req, res, next)=>{
    try{
        const {user} = req;
        const accessToken = user.token();
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({token, user:userTransformed});
    }catch(error){
        return next(error);
    }
};
/**
 * Return a new jwt when given an valid refresh token
 */
exports.refresh = async (req, res, next)=>{
    try{
        const {email, refreshToken} = req.body;
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail : email,
            token : refreshToken,
        });
        const {user, accessToken} = await User.findAndGenerateToken({email,refreshObject});
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);        
    }catch(error){
        return next(error);
    }
};