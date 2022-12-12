const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("giftCards", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false
        },
        cardNumber: {
             field: 'cardNumber', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        cardValue: {
             field: 'cardValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        cardBalance: {
             field: 'cardBalance', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false 
        },
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        updatedDate: {
             field: 'updatedDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: 'updatedDate',
      deletedAt: false
    })
}      