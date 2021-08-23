"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
        },
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Questions",
        },
      },
      answerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Answers",
        },
      },
    },
    {}
  );
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
    });
    Comment.belongsTo(models.Question, {
      foreignKey: "questionId",
    });
    Comment.belongsTo(models.Answer, {
      foreignKey: "answerId",
    });
  };
  return Comment;
};
