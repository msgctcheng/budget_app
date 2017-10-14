module.exports = function(sequelize, DataTypes) {
  var Transactions = sequelize.define("Transactions", {
    Balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        isDecimal: true
      }
    },
    Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        isDecimal: true
      }
    },
    Description: {
      type: DataTypes.STRING
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    createdAt: DataTypes.DATE,
  });

  Transactions.associate = function(models) {
    // We're saying that a Transaction should belong to an User
    // A Transaction can't be created without an User due to the foreign key constraint
    Transactions.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Transactions;
};
