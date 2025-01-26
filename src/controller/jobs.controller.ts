import { Request, Response } from "express";

import { GetUnpaidJobs } from "~/core/usecase/get-unpaid-jobs.usecase";
import { PayJob } from "~/core/usecase/pay-job.usecase";

export class JobsController {
  static async getUnpaidJobs (req: Request, res: Response) {
    const result = await GetUnpaidJobs.execute(req.profile?.id ?? 0);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }

  static async payJob (req: Request, res: Response) {
    const result = await PayJob.execute(req.profile?.id ?? 0, req.params.job_id);

    if (result.ok) {
      res.status(200).json(result.val);
      return;
    }

    res.status(result.val.status).json({ error: result.val.message });
  }
}