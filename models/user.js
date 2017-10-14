module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    googleId: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false,
      len: [1]
    }
  });

  User.associate = function(models) {
    // Associating User with Transactions
    // When an User is deleted, also delete any associated Transactions
    User.hasMany(models.Transactions, {
      onDelete: "cascade"
    });
  };

  return User;
};
