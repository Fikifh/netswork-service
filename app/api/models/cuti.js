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
const cutiSchema = new mongoose.Schema({
    userId:{
        type : String,              
    },        
    awal_cuti:{
        type : Date,        
        index:true,        
    },
    akhir_cuti:{
        type: Date, 
        index:true,
    },
    keterangan:{
        type: String,
        index:true,          
    },
    status:{
        type: Boolean,        
        default : false,
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
cutiSchema.pre('save', async function save(next) {
  try {  
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
cutiSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'email','awal_cuti','akhir_cuti','keterangan', 'status'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },  
});

/**
 * Statics
 */
cutiSchema.statics = {  

  /**
   * Get Present
   *
   * @param {ObjectId} id - The objectId of Present.
   * @returns {Promise<Present, APIError>}
   */
  async get(email) {
    try {
      let cuti;

      if (mongoose.Types.String.isValid(email)) {
        cuti = await this.findOne({email:email}).exec();
      }
      if (cuti) {
        return cuti;
      }

      throw new APIError({
        message: 'cuti does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
},
list({
    page = 1, perPage = 30, userId, awal_cuti, akhir_cuti, keterangan, status,
  }) {
    const options = omitBy({ userId, awal_cuti, akhir_cuti, keterangan, status }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
};
/**
 * @typedef User
 */
module.exports = mongoose.model('Cuti', cutiSchema);