import Joi from "joi";

export const createMessageValidator = Joi.object({
  text: Joi.string().allow("").optional(),
  imagesUrl: Joi.array().items(Joi.string().uri()).optional(),
  videosUrl: Joi.array().items(Joi.string().uri()).optional(),
  receiver: Joi.string().required(),
});
