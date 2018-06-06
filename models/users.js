'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataType) => {
    let Users = sequelize.define('Users', {
        username: DataType.STRING(20),
        email: DataType.STRING(50),
        company_name: DataType.STRING(100),
        vat_number: DataType.STRING(11),
        first_name: DataType.STRING(40),
        last_name: DataType.STRING(40),
        birth_date: DataType.DATEONLY,
        fiscal_code: DataType.STRING(16),
        address: DataType.STRING(100),
        province: DataType.STRING(2),
        city: DataType.STRING(50),
        zip: DataType.STRING(5),
        password: DataType.STRING(70),
        user_type: DataType.STRING(100),
        checksum: DataType.STRING(100)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'users'
    });

    /*  Users.associate = function (models) {
        // Users.hasMany(models.User_keys, {foreignKey: 'id', sourceKey: models.User_keys.})
      };*/

    Users.prototype.verifyPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    return Users;
};
