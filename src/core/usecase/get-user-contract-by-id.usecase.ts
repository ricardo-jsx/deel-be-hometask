import { Err, Ok } from "ts-results";
import { Contract } from "~/core/models";

export class GetUserContractById {
	static async execute (contractId: string, contractorId: number) {
    try {
      const contract = await Contract.findOne({ where: { id: contractId, ContractorId: contractorId } });
      
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