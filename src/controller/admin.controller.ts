import { Request, Response } from "express";

import { FindBestClientsUseCase } from "~/core/usecase/find-best-clients.usecase";
import { FindHighestPaidProfessionUseCase } from "~/core/usecase/find-highest-paid-profession.usecase";
import { JobRepository } from "~/infra/repository/job.repository";

export class AdminController {
  static async getHighestPaidProfession (req: Request, res: Response) {
    const jobRepository = new JobRepository();
    const useCase = new FindHighestPaidProfessionUseCase(jobRepository);

    const result = await useCase.execute(req.query.start as string, req.query.end as string);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }

  static async getBestClients (req: Request, res: Response) {
    const jobRepository = new JobRepository();
    const useCase = new FindBestClientsUseCase(jobRepository);

    const result = await useCase.execute(req.query.start as string, req.query.end as string, req.query.limit as string);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }
}