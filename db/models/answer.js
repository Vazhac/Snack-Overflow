"use strict";
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    "Answer",
    {
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
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Questions",
        },
      },
    },
    {}
  );
  Answer.associate = function (models) {
    // associations can be defined here
    Answer.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Answer.belongsTo(models.Question, {
      foreignKey: "questionId",
    });
    Answer.hasMany(models.Comment, {
      foreignKey: "answerId",
    });
    Answer.hasMany(models.Upvote, {
      foreignKey: "answerId",
    });
  };
  return Answer;
};
