const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("ticketcommission", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ticketServiceId:{
            field:'ticketServiceId',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        }, 
        technicianId: {
             field: 'tipsType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        commissionId: {
             field: 'commissionId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },  
        ownerPercentage: {
             field: 'ownerPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        employeePercentage: {
             field: 'employeePercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        cashPercentage: {
             field: 'cashPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        checkPercentage: {
             field: 'checkPercentage', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },   
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      