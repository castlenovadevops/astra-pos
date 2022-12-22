const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     return sequelize.define("appointments", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        appointmentId: {
             field: 'appointmentId', 
             type: DataTypes.UUID,
             primaryKey: false, 
             allowNull: false,
             defaultValue: DataTypes.UUIDV4
        },
        merchantId: {
             field: 'merchantId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true 
        },
        customerId: {
             field: 'customerId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        guestName: {
             field: 'guestName', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        guestMobile: {
             field: 'guestMobile', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentDate: {
             field: 'appointmentDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentTime: {
             field: 'appointmentTime', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        parentId: {
             field: 'parentId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        ticketId: {
             field: 'ticketId', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentBookedBy: {
             field: 'appointmentBookedBy', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        createdDate: {
             field: 'createdDate', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        },
        appointmentStatus: {
             field: 'appointmentStatus', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: true, 
        }, 
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      