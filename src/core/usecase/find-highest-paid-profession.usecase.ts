import { Err, Ok } from "ts-results";

import { BestProfessionResponse, bestProfessionResponseSchema } from "~/core/dtos/best-profession.dto";
import { JobRepository } from "~/infra/repository/job.repository";
import { UsecaseResponse } from "~/types/usecase-response.type";

export class FindHighestPaidProfessionUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(start: string, end: string): UsecaseResponse<BestProfessionResponse> {
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end) : new Date();

    try {
      const highestPaidProfession = await this.jobRepository.getHighestPaidProfessionBetweenDate(startDate, endDate)

      if(!highestPaidProfession) {
        return new Err({ status: 404, message: 'No data found' });
      }

      const highestPaidProfessionDto = bestProfessionResponseSchema.safeParse(highestPaidProfession.toJSON());

      if(!highestPaidProfessionDto.success) {
        console.error('[FindHighestPaidProfessionUseCase] Error parsing data', highestPaidProfessionDto.error.errors);
        return new Err({ status: 500, message: 'Internal server error' });
      }

      return new Ok(highestPaidProfessionDto.data);
    } catch (error) {
      console.error('[FindHighestPaidProfessionUseCase] Error executing usecase', error);
      return new Err({ status: 500, message: 'Internal server error' });
    }
  }
}
