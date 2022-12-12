const config = require('../config/settings');
const db = config.database;
const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("LPRedeemSettings", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: false
        },
        minimumTicketValue: {
             field: 'minimumTicketValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        }, 
        maximumTicketValue: {
             field: 'maximumTicketValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        pointsCount: {
             field: 'pointsCount', 
             type: DataTypes.INTEGER, 
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
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      