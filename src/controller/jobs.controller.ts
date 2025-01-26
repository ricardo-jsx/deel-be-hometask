import { Request, Response } from "express";

import { GetUnpaidJobs } from "~/core/usecase/get-unpaid-jobs.usecase";
import { PayJob } from "~/core/usecase/pay-job.usecase";
import { JobRepository } from "~/infra/repository/job.repository";
import { ProfileRepository } from "~/infra/repository/profile.repository";
import { ContractRepository } from "~/infra/repository/contract.repository";

export class JobsController {
  static async getUnpaidJobs (req: Request, res: Response) {
    const jobRepository = new JobRepository();
    const getUnpaidJobs = new GetUnpaidJobs(jobRepository);
    
    const result = await getUnpaidJobs.execute(req.profile?.id ?? 0);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }

  static async payJob (req: Request, res: Response) {
    const jobRepository = new JobRepository();
    const profileRepository = new ProfileRepository();
    const contractRepository = new ContractRepository();
    const useCase = new PayJob(jobRepository, profileRepository, contractRepository);
    
    const result = await useCase.execute(req.profile?.id ?? 0, req.params.job_id);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }
}