import { Request, Response } from "express";
import { DepositMoneyUseCase } from "../core/usecase/deposit-money.usecase";
import { ProfileRepository } from "../infra/repository/profile.repository";
import { JobRepository } from "../infra/repository/job.repository";

export class ClientBalanceController {
  static async depositMoney (req: Request, res: Response) {
    const profileRepository = new ProfileRepository();
    const jobRepository = new JobRepository();
    const useCase = new DepositMoneyUseCase(profileRepository, jobRepository);

    const result = await useCase.execute(parseInt(req.params.userId), req.body.amount);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }
}