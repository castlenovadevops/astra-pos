const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("mEmployeePermissions", {
        id:{
            field:'id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        merchantId:{
            field:'merchantId',
            type: DataTypes.UUID,
            primaryKey: false,
            autoIncrement: false
        },
        mEmployeeId: {
             field: 'mEmployeeId', 
             type: DataTypes.UUID, 
             primaryKey: false, 
             allowNull: false 
        },
        webPermissions: {
             field: 'webPermissions', 
             type: DataTypes.JSON, 
             primaryKey: false, 
             allowNull: true 
        },
        posPermissions: {
             field: 'posPermissions', 
             type: DataTypes.JSON, 
             primaryKey: false, 
             allowNull: true,
        },  
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false ,
             defaultValue:1
        },  
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      