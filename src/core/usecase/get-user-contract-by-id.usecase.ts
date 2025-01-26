import { Err, Ok } from "ts-results";

import { ContractResponseDTO, contractResponseSchema } from "~/core/dtos/contract.dto";
import { ContractRepository } from "~/infra/repository/contract.repository";
import { UsecaseResponse } from "~/types/usecase-response.type";

export class GetUserContractById {
  constructor(private readonly contractRepository: ContractRepository) {}

	async execute (contractId: string, userId: number): UsecaseResponse<ContractResponseDTO> {
    try {
      const contract = await this.contractRepository.findContractById(contractId, userId);
      
      if(!contract) {
        return new Err({ status: 404, message: `Contract not found` });
      }

      // Parse the contract data to the DTO
      const contractDto = contractResponseSchema.safeParse(contract);

      if(contractDto.success === false) {
        console.error('Unable to parse data', contractDto.error.errors);
        return new Err({ status: 500, message: `Internal server error` });
      }

      return new Ok(contractDto.data);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}