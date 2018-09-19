const httpStatus = require('http-status');
const { omit } = require('lodash');
const Present = require('../models/presensi');
const User = require('../models/userModel');
const { handler: errorHandler } = require('../../middleware/error');

exports.get = (req, res) => res.json(req.locals.cuti.transform());

exports.load = async (req, res, next, id) => {
  try {
    const present = await Present.get(id);
    req.locals = { present };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
/**
 * Post Present
 * @private
 */
exports.present = async (req, res, next) => {
  	try{
  		const kehadiran = new Present(req.body);
   		const savedKehadiran = await kehadiran.save();        
        const PresentTransformed = savedKehadiran.transform();     
        res.status(httpStatus.CREATED);
        return res.json(PresentTransformed);
    }catch(error){
        return error;
    }
};
/**
 * Update existing present
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const present = Object.assign(req.locals.user, updatedUser);

  present.save()
    .then(savedPresent => res.json(savedPresent.transform()))
    .catch(e => next(Present(e)));
};

exports.list = async (req, res, next) => {
  try {
    const present = await Present.list(req.query);
    const transformedPresent = presents.map(present => present.transform());
    res.json(transformedPresent);
  } catch (error) {
    next(error);
  }
};
exports.myPresent = async (req, res, next)=>{
  try {
    const idUser = req.params.userId;
    const present = await Present.myPresent(idUser);
    const transformedPresent = presents.map(present => present.transform());
    res.json(transformedPresent);
  } catch (error) {
    next(error);
  }
};