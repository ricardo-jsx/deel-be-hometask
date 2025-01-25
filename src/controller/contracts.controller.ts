import { Request, Response } from "express";
import { GetUserContractById } from "~/core/usecase/get-user-contract-by-id.usecase";

export class ContractsController {
	static async getContractById (req: Request, res: Response) {
    const result = await GetUserContractById.execute(req.params.id, req.profile?.id ?? 0);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
	}
}