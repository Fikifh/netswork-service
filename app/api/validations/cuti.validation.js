const Joi = require('joi');

module.exports = {   
  // GET /api/cuti
  listCuti: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      idUser: Joi.string(),
      awal_cuti: Joi.string(),      
      akhir_cuti: Joi.string(),      
      keterangan: Joi.string(),      
      status: Joi.string(),  
    },
  },

  // POST api/present/addPresent
  addCuti: {
    body: {
      userId: Joi.string().required(),
      backlog: Joi.string().required(),
      task: Joi.string().required(),
      note: Joi.string().required(),
    },
  },

  // PATCH /api/present/:presentId
  updateCuti: {
    body: {
      userId: Joi.string(),
      backlog: Joi.string(),
      task: Joi.string(),
      note: Joi.string(),      
    },
    param: {
      cutiId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
