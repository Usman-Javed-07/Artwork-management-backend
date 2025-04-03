const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Artwork = sequelize.define(
  "Artwork",
  {
    artist: { 
      type: DataTypes.STRING, 
      allowNull: false
     },
    title: {
       type: DataTypes.STRING,
        allowNull: false 
      },
    year: {
       type: DataTypes.INTEGER,
        allowNull: false
       },
    dimensions: {
       type: DataTypes.STRING, allowNull: false },
    technique: { type: DataTypes.STRING,
       allowNull: false 
      },
    medium: {
       type: DataTypes.STRING,
        allowNull: false
       },
    numberOfEditions: {
       type: DataTypes.INTEGER,
        allowNull: true
       },
    editionNumber: { 
      type: DataTypes.INTEGER,
       allowNull: true
       },
    provenance: { 
      type: DataTypes.TEXT,
       allowNull: true
       },
    literatureList: {
       type: DataTypes.TEXT,
        allowNull: true 
      },
    exhibitionList: {
       type: DataTypes.TEXT,
        allowNull: true
       },
    extraInformation: {
       type: DataTypes.TEXT,
        allowNull: true 
      },
    pictureUrl: { type: DataTypes.STRING,
       allowNull: false 
      },
    additionalPictures: { 
      type: DataTypes.JSON,
       allowNull: true 
      },
    invoiceUrl: {
       type: DataTypes.STRING,
        allowNull: true
       },
  },
  {
    timestamps: true,
  }
);

module.exports = Artwork;
