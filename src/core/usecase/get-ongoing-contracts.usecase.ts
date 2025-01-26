import { Err, Ok } from "ts-results";

import { ContractRepository } from "~/infra/repository/contract.repository";

export class GetOngoingContracts {
  constructor(private readonly contractRepository: ContractRepository) {}
  
  async execute (userId: number) {
    try {
      const contracts = await this.contractRepository.findAllOngoingContracts(userId);

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