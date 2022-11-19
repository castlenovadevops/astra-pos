const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("ticketdiscount", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ticketId:{
            field:'ticketId',
            type: DataTypes.UUID,
            primaryKey: true
        }, 
        discountAmount: {
             field: 'discountAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        discountId: {
             field: 'discountId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        discountValue: {
             field: 'discountValue', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        discountType: {
             field: 'discountType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        discountDivisionType: {
             field: 'discountDivisionType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        discountOwnerDivision: {
             field: 'discountOwnerDivision', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        discountEmployeeDivision: {
             field: 'discountEmployeeDivision', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }, 
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        createdBy: {
             field: 'createdBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        }
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      