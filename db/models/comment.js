"use strict";
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
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
