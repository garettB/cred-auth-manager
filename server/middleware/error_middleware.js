'use strict'

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  NOT_FOUND,
  UNPROCESSABLE,
  GENERIC_ERROR
} = require('../helpers/error_helper')

// Catch any Sequelize-generated errors (e.g., DB validation errors) and
// consider them "unprocessable". If the process got the point of trying to do
// something in the database, it must have at least "understood" the request,
// but was unable to process the request, hence 422 response.
const sequelizeError = (err, req, res, next) => {
  if (!err.status && err.name && err.name.includes('Sequelize')) {
    return res.status(UNPROCESSABLE).send({
      success: false,
      message: err.message,
      errors: err.errors
    })
  }

  return next(err)
}

const unauthorized = (err, req, res, next) => {
  if (err.status !== UNAUTHORIZED) return next(err)

  res.status(UNAUTHORIZED).send({
    success: false,
    message: err.message || 'Unauthorized',
    error: err
  })
}

const forbidden = (err, req, res, next) => {
  if (err.status !== FORBIDDEN) return next(err)

  res.status(FORBIDDEN).send({
    success: false,
    message: err.message || 'Forbidden',
    error: err
  })
}

const conflict = (err, req, res, next) => {
  if (err.status !== CONFLICT) return next(err)

  res.status(CONFLICT).send({
    success: false,
    message: err.message || 'Conflict',
    error: err
  })
}

const badRequest = (err, req, res, next) => {
  if (err.status !== BAD_REQUEST) return next(err)

  res.status(BAD_REQUEST).send({
    success: false,
    message: err.message || 'Bad Request',
    error: err
  })
}

const unprocessable = (err, req, res, next) => {
  if (err.status !== UNPROCESSABLE) return next(err)

  res.status(UNPROCESSABLE).send({
    success: false,
    message: err.message || 'Unprocessable entity',
    error: err
  })
}

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const notFound = (err, req, res, next) => {
  if (err.status !== NOT_FOUND) return next(err)

  res.status(NOT_FOUND).send({
    success: false,
    message: 'The requested resource could not be found'
  })
}

// If there's still an error at this point, return a generic 500 error.
const genericError = (err, req, res, next) => {
  console.log('err: ', err)
  res.status(GENERIC_ERROR).send({
    success: false,
    message: err.message || 'Internal server error',
    error: err
  })
}

// If there's nothing left to do after all this (and there's no error),
// return a 404 error.
const catchall = (req, res, next) => {
  res.status(NOT_FOUND).send({
    success: false,
    message: 'The requested resource could not be found'
  })
}

module.exports = {
  sequelizeError,
  unauthorized,
  forbidden,
  conflict,
  badRequest,
  unprocessable,
  genericError,
  notFound,
  catchall
}
