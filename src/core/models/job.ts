import { DataTypes, Model } from "sequelize";

import { sequelize } from "~/infra/database/database";

export class Job extends Model {
  declare id: number;
  declare description: string;
  declare price: number;
  declare paid: boolean;
  declare paymentDate: Date;

  // timestamps!
  declare createdAt: Date;
  declare updatedAt: Date;
}

Job.init(
  {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price:{
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
    paymentDate:{
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);