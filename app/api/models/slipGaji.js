const mongoose = require('mongoose');
const httpStatus = require('http-status');
const {omitBy, isNil} = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const {env, jwtSecret, jwtExpirationInterval} = require('../../config/variables');

/**
 * Present Schema
 * @private
 */
const slipgajiSchema = new mongoose.Schema({
    email:{
        type : String,        
        required: true,        
    },    
    nama:{
        type:String,
        maxlength:128,
        index:true,
        trim:true,
    },
    waktu:{
        type : String,
        maxlength: 300,
        index:true,        
    },
    status:{
        type: String, 
        index:true,
    },
    gaji:{
        type: Numerik,
        index:true,          
    },    
  }, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {  
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'id_user','nama','waktu', 'status','gaji'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },  
});

/**
 * Statics
 */
userSchema.statics = {  

  /**
   * Get Present
   *
   * @param {ObjectId} id - The objectId of Present.
   * @returns {Promise<Present, APIError>}
   */
  async get(id_user) {
    try {
      let slipGaji;

      if (mongoose.Types.ObjectId.isValid(id_user)) {
        slipGaji = await this.findById(id_user).exec();
      }
      if (slipGaji) {
        return slipGaji;
      }

      throw new APIError({
        message: 'slipGaji does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('SlipGaji',slipgajiSchema);