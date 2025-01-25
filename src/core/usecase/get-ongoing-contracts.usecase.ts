import sequelize from "sequelize";
import { Op } from "sequelize";
import { Err, Ok } from "ts-results";

import { Contract } from "~/core/models";

export class GetOngoingContracts {
  static async execute (userId: number) {
    try {
      const contracts = await Contract.findAll({
        where: {
          status: { [Op.not]: 'terminated'},
          [Op.or]: [
            { ContractorId: userId },
            { ClientId: userId }
          ]
        }
      })

      if(!contracts.length) {
        return new Err({ status: 404, message: `No ongoing contracts found for user with id ${userId}` });
      }

      return new Ok(contracts);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}