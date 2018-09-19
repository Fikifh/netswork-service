const httpStatus = require('http-status');
const { omit } = require('lodash');
const Cuti = require('../models/cuti');
const { handler: errorHandler } = require('../../middleware/error');


exports.load = async (req, res, next, id) => {
  try {
    const cuti = await Cuti.get(id);
    req.locals = { cuti };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = async(req, res)=>{
	const id = req.param._id;
	Cuti.findOne(id,
		function(err, cuti){
			if(err){
				res.send(err);
				console.log(err);
			}
		res.json(cuti);
		});
};
/**
 * Post Present
 * @private
 */
exports.ajukan = async (req, res, next) => {
  	try{
  		const cuti = new Cuti(req.body);
   		const savedcuti = await cuti.save();        
        const cutiTransformed = savedcuti.transform();     
        res.status(httpStatus.CREATED);
        return res.json(cutiTransformed);
    }catch(error){
        return error;
    }
};
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const cuties = await Cuti.list(req.query);
    const transformedCuties = cuties.map(cuti => cuti.transform());
    res.json(transformedCuties);
  } catch (error) {
    next(error);
  }
};
/**
 * Update existing present
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedCuti = omit(req.body, ommitRole);
  const cuti = Object.assign(req.locals.user, updatedCuti);

  cuti.save()
    .then(savedCuti => res.json(savedCuti.transform()))
    .catch(e => next(Present(e)));
};
/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { cuti } = req.locals;

  cuti.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

exports.submissionListLeave = async (req, res, next) =>{
	try {
    const cuties = await Cuti.list(req.query);
    const transformedCuties = cuties.map(cuti => cuti.transform());
    const code = httpStatus.OK;
    const status = {message:'OK', code};
    res.json({status,transformedCuties});
  } catch (error) {
    next(error);
  }
};

exports.approveSubmissionListLeave = async (req, res, next)=>{
 	try{
 	const cuties = await Cuti.findOne({where:{userId:req.params.userId}});
 		/*function(err, cuti) {
        if (err){
            res.send(err);
        }        
        //cuti.status = req.body.status;  // update the cuti info        
        //cuti.save(function(err) {
            //if (err){
                //res.send(err);  
                //}
                //res.json({ message: 'Status upproved!' });                      
        //});        
    }); */
    if(cuties){    
    	res.json(cuties);
	}
    }catch(err){
    	return err;
    }
};
exports.approveSubmissionListLeavee = async(req, res)=>{
const id = '5ab045ec87719812709942c9';
	Cuti.findOne(id,
		function(err, cuti){
			if(err){
				res.send(err);
				console.log(err);
			}
		res.json(cuti);
		});

};