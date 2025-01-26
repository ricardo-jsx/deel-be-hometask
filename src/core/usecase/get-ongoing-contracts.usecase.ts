import { Err, Ok } from "ts-results";

import { ContractsResponseDTO, contractsResponseSchema } from "~/core/dtos/contract.dto";
import { ContractRepository } from "~/infra/repository/contract.repository";
import { UsecaseResponse } from "~/types/usecase-response.type";

export class GetOngoingContracts {
  constructor(private readonly contractRepository: ContractRepository) {}
  
  async execute (userId: number): UsecaseResponse<ContractsResponseDTO> {
    try {
      const contracts = await this.contractRepository.findAllOngoingContracts(userId);

      if(!contracts.length) {
        return new Err({ status: 404, message: `No ongoing contracts found for user with id ${userId}` });
      }

      // Parse the contract data to the DTO
      const contractsDto = contractsResponseSchema.safeParse(contracts);

      if(contractsDto.success === false) {
        console.error('Unable to parse data', contractsDto.error.errors);
        return new Err({ status: 500, message: `Internal server error` });
      }

      return new Ok(contractsDto.data);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}