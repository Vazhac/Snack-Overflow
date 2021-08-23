'use strict';
module.exports = (sequelize, DataTypes) => {
  const Upvotes = sequelize.define('Upvotes', {
    isPositive: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    answerId: DataTypes.INTEGER
  }, {});
  Upvotes.associate = function(models) {
    // associations can be defined here
  };
  return Upvotes;
};