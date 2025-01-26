import { Err, Ok } from "ts-results";

import { BestClientsResponse, bestClientsResponseSchema } from "~/core/dtos/best-client.dto";
import { JobRepository } from "~/infra/repository/job.repository";
import { UsecaseResponse } from "~/types/usecase-response.type";

export class FindBestClientsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(start: string, end: string, limit: string): UsecaseResponse<BestClientsResponse> {
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end) : new Date();
    const limitValue = parseInt(limit) || 2;

    const topPayingClients = await this.jobRepository.findTopPayingClients(startDate, endDate, limitValue)

    if(!topPayingClients) {
      return new Err({ status: 404, message: 'No data found' });
    }

    const topPayingClientsDto = bestClientsResponseSchema.safeParse(topPayingClients.map(client => client.toJSON()));

    if(!topPayingClientsDto.success) {
      console.error('[FindBestClientsUseCase] Error parsing data', topPayingClientsDto.error.errors);
      return new Err({ status: 500, message: 'Internal server error' });
    }

    return new Ok(topPayingClientsDto.data);
  }
}