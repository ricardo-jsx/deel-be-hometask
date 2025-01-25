import { DataTypes, Model } from "sequelize";

import { sequelize } from "~/infra/database/database";
import { Contract } from "./contract";
import { Job } from "./job";

export class Profile extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare profession: string;
  declare balance: number;
  declare type: 'client' | 'contractor';

  // timestamps!
  declare createdAt: Date;
  declare updatedAt: Date;

  // Note this is optional since it's only populated when explicitly requested in code
  declare Contract?: Contract;
  declare Jobs?: Job[];
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false
    },
    balance:{
      type:DataTypes.DECIMAL(12,2)
    },
    type: {
      type: DataTypes.ENUM('client', 'contractor')
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);