const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
     return sequelize.define("sys_settings", {
        id:{
            field:'id',
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        feature: {
             field: 'feature', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        value: {
             field: 'value', 
             type: DataTypes.STRING(255), 
             primaryKey: false, 
             allowNull: false 
        },
        status: {
             field: 'status', 
             type: DataTypes.INTEGER, 
             primaryKey: false, 
             allowNull: false,
             defaultValue:1,
        }, 
    }, {
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false
    })
}      