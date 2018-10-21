import bcrypt from 'bcrypt';

import db from '../../utils/dbConnection';

const userAttributes = {
  userName: String,
  password: String
};

const userMethods = {
  beforeSave: function() {
    if (this.hasChanged('password')) {
      this.set('password', this.encryptPassword(this.get('password')));
    }
  },
  authenticate: function(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.get('password'));
  },
  encryptPassword: function(plainTextPassword) {
    if (!plainTextPassword) {
      return '';
    } else {
      var salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPassword, salt);
    }
  },
  initialize: function() {
    this.on('saving', this.beforeSave);
  }
};

const User = db.Model.extend({
  tableName: 'User',
  ...userAttributes,
  ...userMethods
});

module.exports = User;
