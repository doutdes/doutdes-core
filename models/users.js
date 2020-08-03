'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataType) => {
    let Users = sequelize.define('Users', {
        username:       DataType.STRING(40),
        email:          DataType.STRING(50),
        company_name:   DataType.STRING(100),
        vat_number:     DataType.STRING(11),
        first_name:     DataType.STRING(40),
        last_name:      DataType.STRING(40),
        birth_place:    DataType.STRING(50),
        birth_date:     DataType.DATEONLY,
        fiscal_code:    DataType.STRING(16),
        address:        DataType.STRING(100),
        province:       DataType.STRING(2),
        city:           DataType.STRING(50),
        zip:            DataType.STRING(5),
        password:       DataType.STRING(70),
        user_type:      DataType.STRING(100),
        checksum:       DataType.STRING(100),
        is_verified:    DataType.BOOLEAN,
        token:          DataType.STRING(50),
        lang:           DataType.STRING(2)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'users',
    });

      Users.associate = function (models) {
          Users.belongsToMany(models.Dashboards, {
              through: {
                  model: models.UserDashboards
              },
              foreignKey: 'user_id'
          });

          Users.hasMany(models.Calendar, {foreignKey: 'user_id', sourceKey: 'id'});
          Users.hasMany(models.FbToken, {foreignKey: 'user_id'});
          Users.hasMany(models.GaToken, {foreignKey: 'user_id'});
      };

    Users.prototype.verifyPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    return Users;
};
