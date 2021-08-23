"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: "userId",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
    });
    User.hasMany(models.Question, {
      foreignKey: "userId",
    });
    User.hasMany(models.Upvote, {
      foreignKey: "userId",
    });
  };
  return User;
};
