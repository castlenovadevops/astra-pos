function applyExtraSetup(sequelize) {
	const models = sequelize.models;
   

    models.mProducts.hasMany(models.mProductCategory, {foreignKey: 'mProductId',sourceKey: 'mProductId'});
    models.mProductCategory.belongsTo(models.mProducts,  {foreignKey: 'mProductId', targetKey: 'mProductId'});
    models.mProducts.hasMany(models.mProductTax, {foreignKey: 'mProductId',sourceKey: 'mProductId'});
    models.mProductTax.belongsTo(models.mProducts, {foreignKey: 'mProductId', targetKey: 'mProductId'});


    models.merchantEmployees.hasMany(models.mEmployeeCommission, {foreignKey: 'mEmployeeId',sourceKey: 'mEmployeeId'});
    models.mEmployeeCommission.belongsTo(models.merchantEmployees, {foreignKey: 'mEmployeeId',targetKey: 'mEmployeeId'});
    
    models.merchantEmployees.hasMany(models.mEmployeePermissions, {foreignKey: 'mEmployeeId',sourceKey: 'mEmployeeId'});
    models.mEmployeePermissions.belongsTo(models.merchantEmployees, {foreignKey: 'mEmployeeId',targetKey: 'mEmployeeId'});
}

module.exports = { applyExtraSetup };