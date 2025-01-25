import { Op } from "sequelize";
import { Err, Ok } from "ts-results";
import { Contract } from "~/core/models";

export class GetUserContractById {
	static async execute (contractId: string, userId: number) {
    try {
      const contract = await Contract.findOne({
        where: {
          id: contractId,
          [Op.or]: [
            { ContractorId: userId },
            { ClientId: userId }
          ]
        }
      });
      
      if(!contract) {
        return new Err({ status: 404, message: `Contract not found` });
      }

      return new Ok(contract);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}