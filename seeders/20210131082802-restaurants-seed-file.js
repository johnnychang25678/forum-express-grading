'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map((item, index) => ({
        id: index + 1,
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        createdAt: new Date(),
        updatedAt: new Date(),
        CategoryId: Math.floor(Math.random() * 6) * 10 + 1 // random (0 ~ 5)*10 + 1 = 1, 11, 21, 31, 41, 51
      })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
};
