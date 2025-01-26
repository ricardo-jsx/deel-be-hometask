import { Err, Ok } from "ts-results";

import { UnpaidJobsResponseDTO, unpaidJobsResponseSchema } from "~/core/dtos/unpaid-jobs.dto";
import { UsecaseResponse } from "~/types/usecase-response.type";
import { JobRepository } from "../../infra/repository/job.repository";

export class GetUnpaidJobs {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute (userId: number): UsecaseResponse<UnpaidJobsResponseDTO> {
    try {
      const unpaidJobs = await this.jobRepository.findAllUnpaidJobs(userId);

      if(!unpaidJobs.length) {
        return new Err({ status: 200, message: `No unpaid jobs found` });
      }

      const unpaidJobsDTO = unpaidJobsResponseSchema.safeParse(unpaidJobs);

      if(!unpaidJobsDTO.success) {
        console.error('[GetUnpaidJobsUseCase] error on parse data', unpaidJobsDTO.error.errors);
        return new Err({ status: 500, message: `Internal server error` });
      }

      return new Ok(unpaidJobsDTO.data);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}