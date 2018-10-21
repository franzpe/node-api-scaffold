import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import config from '../config/config';
import User from '../api/user/userModel';
const checkToken = expressJwt({
  secret: config.secrets.jwt
});

export const decodeToken = function() {
  return function(req, res, next) {
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  };
};

export const getFreshUser = function() {
  return function(req, res, next) {
    User.where({
      id: req.user.id
    })
      .fetch()
      .then(user => {
        if (user) {
          req.user = user.toJSON();
          next();
        } else {
          req.status(401).send('Unauthorized');
        }
      })
      .catch(err => next(err));
  };
};

export const verifyUser = function() {
  return function(req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    // if no username or password then send
    if (!userName || !password) {
      res.status(400).send('You need a username and password');
      return;
    }
    User.collection()
      .fetchOne({
        userName
      })
      .then(user => {
        if (!user) {
          res.status(401).send('No user with the given username');
        } else {
          if (!user.authenticate(password)) {
            res.status(401).send('Wrong password');
          } else {
            // if everything is good,
            // then attach to req.user
            // and call next so the controller
            // can sign a token from the req.user._id
            req.user = user;
            next();
          }
        }
      });
  };
};

// util method to sign tokens on signup
export const signToken = function(id) {
  return jwt.sign(
    {
      id: id
    },
    config.secrets.jwt,
    {
      expiresIn: config.expireTime
    }
  );
};
