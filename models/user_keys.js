'use strict';

module.exports = (sequelize, DataType) => {
  var User_keys = sequelize.define('user_keys', {
    user_id: {
      type: DataType.INTEGER(5),
      primaryKey: true,
    },
    service: {
      type: DataType.INTEGER(3),
      primaryKey: true
    },
    api_key: DataType.STRING(100)
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'user_keys'
  });

  User_keys.associate = function (models) {
    User_keys.hasMany(models.Users, {foreignKey: 'id', sourceKey: models.Users.id})
  };

  return User_keys;
};

