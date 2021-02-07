'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.belongsTo(models.Category) // Category 1 -> M Restaurant
      Restaurant.hasMany(models.Comment) // Restaurant 1 -> M Comment
      Restaurant.belongsToMany(models.User, { // Restaurant M -> M User
        through: models.Favorite, // join table: Favorite Model 
        foreignKey: 'RestaurantId', // FK: RestaurantId
        as: 'FavoriteUsers' // restaurant.FavoriteUsers to query data
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};