"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Answer, {
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
