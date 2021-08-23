"use strict";
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
      },
    },
    {}
  );
  Question.associate = function (models) {
    // associations can be defined here
    Question.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Question.hasMany(models.Answer, {
      foreignKey: "questionId",
    });
    Question.hasMany(models.Comment, {
      foreignKey: "questionId",
    });
    Question.hasMany(models.Upvote, {
      foreignKey: "questionId",
    });
  };
  return Question;
};
