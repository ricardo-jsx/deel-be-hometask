import { Err, Ok } from "ts-results";

import { JobRepository } from "../../infra/repository/job.repository";

export class GetUnpaidJobs {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute (userId: number) {
    try {
      const unpaidJobs = await this.jobRepository.findAllUnpaidJobs(userId);

      if(!unpaidJobs.length) {
        return new Err({ status: 200, message: `No unpaid jobs found` });
      }

      return new Ok(unpaidJobs);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}