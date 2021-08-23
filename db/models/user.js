'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Question, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Upvote, {
      foreignKey: 'userId',
    });
  };
  return User;
};
