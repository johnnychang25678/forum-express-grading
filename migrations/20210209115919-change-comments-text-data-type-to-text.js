'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('comments', 'text', {
      type: Sequelize.TEXT
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('comments', 'text', {
      type: Sequelize.STRING
    })
  }
};
