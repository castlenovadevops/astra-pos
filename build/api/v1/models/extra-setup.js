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


    models.mCustomers.hasMany(models.tickets, {foreignKey: 'customerId',sourceKey: 'mCustomerId'});
    models.tickets.belongsTo(models.mCustomers, {foreignKey: 'customerId',targetKey: 'mCustomerId'});

    models.tickets.hasMany(models.ticketservices, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
    models.ticketservices.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

    models.tickets.hasMany(models.ticketdiscountcommission, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
    models.ticketdiscountcommission.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

    models.tickets.hasMany(models.ticketpayment, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
    models.ticketpayment.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

    models.tickets.hasMany(models.ticketdiscount, {foreignKey: 'ticketId',sourceKey: 'ticketId'});
    models.ticketdiscount.belongsTo(models.tickets, {foreignKey: 'ticketId',targetKey: 'ticketId'});

    models.ticketservices.hasMany(models.ticketservicetax, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
    models.ticketservicetax.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});

    models.ticketservices.hasMany(models.ticketservicediscount, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
    models.ticketservicediscount.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});

    models.ticketservices.hasMany(models.ticketcommission, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
    models.ticketcommission.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});

    models.ticketservices.hasMany(models.ticketservicediscountcommission, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
    models.ticketservicediscountcommission.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'});

    models.ticketservices.hasMany(models.ticketTips, {foreignKey: 'ticketServiceId',sourceKey: 'ticketServiceId'});
    models.ticketTips.belongsTo(models.ticketservices, {foreignKey: 'ticketServiceId',targetKey: 'ticketServiceId'}); 

}

module.exports = { applyExtraSetup };