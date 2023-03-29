const { Joi, celebrate } = require('celebrate');

const urlRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#*/;

const getUsersByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

const getCardsByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'any.require': 'Некорректный email',
      }),
    password: Joi.string().required()
      .messages({
        'any.require': 'Некорректный пароль',
      }),
  }),
});

const postUsersValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'any.require': 'Некорректное имя пользователя',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'any.require': 'Некорректное информация о пользователи',
      }),
    avatar: Joi.string().pattern(urlRegExp)
      .messages({
        'any.require': 'Некорректная ссылка',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.require': 'Некорректный email',
      }),
    password: Joi.string().required()
      .messages({
        'any.require': 'Некорректный пароль',
      }),
  }),
});

const postCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.require': 'Некорректное имя пользователя',
      }),
    link: Joi.string().required().pattern(urlRegExp)
      .messages({
        'any.require': 'Некорректная ссылка',
      }),
  }),
});

const patchUsersInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.require': 'Некорректное имя пользователя',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'any.require': 'Некорректное информация о пользователи',
      }),
  }),
});

const patchUsersAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp)
      .messages({
        'any.require': 'Некорректная ссылка',
      }),
  }),
});

module.exports = {
  postUsersValidation,
  postCardValidation,
  patchUsersInfoValidation,
  patchUsersAvatarValidation,
  loginValidation,
  getUsersByIdValidation,
  getCardsByIdValidation,
};
