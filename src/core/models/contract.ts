import { DataTypes, Model } from "sequelize";

import { sequelize } from "~/infra/database/database";

export class Contract extends Model {
  declare id: number;
  declare terms: string;
  declare status: 'new' | 'in_progress' | 'terminated';

  // timestamps!
  declare createdAt: Date;
  declare updatedAt: Date;

  // foreign keys
  declare ContractorId: number;
}

Contract.init(
  {
    terms: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status:{
      type: DataTypes.ENUM('new','in_progress','terminated')
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);