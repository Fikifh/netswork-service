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
const presentSchema = new mongoose.Schema({
    userId:{
        type: String,
    },        
    backlog:{
        type : String,                      
    },
    task:{
        type: String, 
    },
    note:{
        type:String,         
    }    
  }, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
presentSchema.pre('save', async function save(next) {
  try {  
    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
presentSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'userId','backlog', 'task','note','createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },  
});

/**
 * Statics
 */
presentSchema.statics = {  

  /**
   * Get Present
   *
   * @param {ObjectId} id - The objectId of Present.
   * @returns {Promise<Present, APIError>}
   */
  async get(id_user) {
    try {
      let present;

      if (mongoose.Types.ObjectId.isValid(id_user)) {
        present = await this.findById(id_user).exec();
      }
      if (present) {
        return present;
      }

      throw new APIError({
        message: 'present does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  list({
    page = 1, perPage = 30, userId, backlog, task, note,
  }) {
    const options = omitBy({ userId, backlog, task, note }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
  myPresent : function listMyPresent(Iduser){
    page = 1, perPage = 30;
    return this.find({'userId':Iduser})
    .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }
}

/**
 * @typedef User
 */
module.exports = mongoose.model('Present', presentSchema);