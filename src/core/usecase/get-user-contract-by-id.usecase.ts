import { Op } from "sequelize";
import { Err, Ok } from "ts-results";

import { Contract } from "~/core/models";
import { ContractRepository } from "~/infra/repository/contract.repository";

export class GetUserContractById {
  constructor(private readonly contractRepository: ContractRepository) {}

	async execute (contractId: string, userId: number) {
    try {
      const contract = await this.contractRepository.findContractById(contractId, userId);
      
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