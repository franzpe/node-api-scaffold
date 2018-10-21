import bcrypt from 'bcrypt';

import db from '../../utils/dbConnection';

const userAttributes = {
  userName: String,
  // Do not ever store password as a plain text
  password: String
};

const userMethods = {
  beforeSave: function() {
    if (this.hasChanged('password')) {
      this.set('password', this.encryptPassword(this.get('password')));
    }
  },
  // Check if passwords match
  authenticate: function(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.get('password'));
  },
  // Password hashing
  encryptPassword: function(plainTextPassword) {
    if (!plainTextPassword) {
      return '';
    } else {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPassword, salt);
    }
  },
  initialize: function() {
    this.on('saving', this.beforeSave);
  },
  // We're not returning password from user object
  toJson: function() {
    const obj = this.toJSON();
    delete obj.password;
    return obj;
  }
};

const User = db.Model.extend({
  tableName: 'User',
  ...userAttributes,
  ...userMethods
});

module.exports = User;
