"use strict";
module.exports = (sequelize, DataTypes) => {
  const Upvote = sequelize.define(
    "Upvote",
    {
      isPositive: {
        type: DataTypes.BOOLEAN,
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
        allowNull: true,
        references: {
          model: "Questions",
        },
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Answers",
        },
      },
    },
    {}
  );
  Upvote.associate = function (models) {
    // associations can be defined here
    Upvote.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Upvote.belongsTo(models.Question, {
      foreignKey: "questionId",
    });
    Upvote.belongsTo(models.Answer, {
      foreignKey: "answerId",
    });
  };
  return Upvote;
};
