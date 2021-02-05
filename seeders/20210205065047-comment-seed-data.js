'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 1,
        RestaurantId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 1,
        RestaurantId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 1,
        RestaurantId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 1,
        RestaurantId: 34,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 2,
        RestaurantId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 2,
        RestaurantId: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi est sunt quia nesciunt`,
        UserId: 2,
        RestaurantId: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});
  }
};
