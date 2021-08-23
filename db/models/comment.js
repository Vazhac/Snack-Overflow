'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    message: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    answerId: DataTypes.INTEGER
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Comment.belongsTo(models.Question, {
      foreignKey: 'questionId',
    });
    Comment.belongsTo(models.Answer, {
      foreignKey: 'answerId',
    });
  };
  return Comment;
};
