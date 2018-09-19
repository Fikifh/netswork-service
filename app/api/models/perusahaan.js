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
const perusahaanSchema = new mongoose.Schema({    
    nama_perusahaan:{
        type:String,        
        index:true,
        trim:true,
    },
    email:{
        type : String,
        match : /^\S+@\S+\.\S+$/,
        required: true,
        unique : true,
        trim : true,
        lowercase:true,        
    },
    profil:{
        type: String, 
        index:true,
    },
    peraturan:{
        type: String,
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
    const fields = ['id', 'nama_perusahaan','email','profil', 'peraturan'];

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
  async get(id) {
    try {
      let perusahaan;

      if (mongoose.Types.ObjectId.isValid(id)) {
        perusahaan = await this.findById(id).exec();
      }
      if (perusahaan) {
        return perusahaan;
      }

      throw new APIError({
        message: 'perusahaan does not exist',
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
module.exports = mongoose.model('Perusahaan', perusahaanSchema);