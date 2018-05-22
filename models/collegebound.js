module.exports = function(sequelize, DataTypes) {
    var college = sequelize.define("college", {
      schoolid: {type: DataTypes.INTEGER, allowNull: false, primaryKey: true}, 
      schoolname: DataTypes.STRING,
      searchCount: DataTypes.INTEGER
    });
    return college;
  };