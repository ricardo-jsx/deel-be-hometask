import { Request, Response } from "express";

import { GetUserContractById } from "~/core/usecase/get-user-contract-by-id.usecase";
import { GetOngoingContracts } from "~/core/usecase/get-ongoing-contracts.usecase";
import { ContractRepository } from "~/infra/repository/contract.repository";

export class ContractsController {
	static async getContractById (req: Request, res: Response) {
    const contractRepository = new ContractRepository();
    const useCase = new GetUserContractById(contractRepository);
    
    const result = await useCase.execute(req.params.id, req.profile?.id ?? 0);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
	}

  static async getOngoingContracts(req: Request, res: Response) {
    const contractRepository = new ContractRepository();
    const useCase = new GetOngoingContracts(contractRepository);

    const result = await useCase.execute(req.profile?.id ?? 0);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
}
}