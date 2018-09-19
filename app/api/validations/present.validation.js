const Joi = require('joi');

module.exports = {

  // GET /api/present
  listPresent: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      userId: Joi.string(), 
      backlog: Joi.string(),
      task: Joi.string(),      
      note: Joi.string(),                 
    },
  },

  // POST api/present/addPresent
  addPresent: {
    body: {
      userId: Joi.string().required(),
      backlog: Joi.string().required(),
      task: Joi.string().required(),
      note: Joi.string().required(),
    },
  },

  // PATCH /api/present/:presentId
  updatePresent: {
    body: {
      backlog: Joi.string(),
      task: Joi.string(),
      note: Joi.string(),      
    },
    params: {
      presentId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
