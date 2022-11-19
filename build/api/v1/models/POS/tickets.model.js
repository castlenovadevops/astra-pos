const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define("tickets", {
        ticketId:{
            field:'ticketId',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        ticketCode: {
             field: 'ticketCode', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        POSId: {
             field: 'POSId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        ownerTechnician: {
             field: 'ownerTechnician', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        customerId: {
             field: 'customerId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        taxApplied: {
             field: 'taxApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:0
        },
        serviceDiscountApplied: {
             field: 'serviceDiscountApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:0
        },
        ticketDiscountApplied: {
             field: 'ticketDiscountApplied', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:0
        },
        tipsAmount: {
             field: 'tipsAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        taxAmount: {
             field: 'taxAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        serviceAmount: {
             field: 'serviceAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        ticketTotalAmount: {
             field: 'ticketTotalAmount', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        ticketNotes: {
             field: 'ticketNotes', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        ticketStatus: {
             field: 'ticketStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
             defaultValue:'Active'
        },
        ticketType: {
             field: 'ticketType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
             defaultValue:'New'
        },
        tipsType: {
             field: 'tipsType', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false,
        },
        paymentStatus: {
             field: 'paymentStatus', 
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