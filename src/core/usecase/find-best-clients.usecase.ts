import { Err, Ok } from "ts-results";

import { JobRepository } from "~/infra/repository/job.repository";

export class FindBestClientsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(start: string, end: string, limit: string) {
    const startDate = start ? new Date(start) : new Date(0);
    const endDate = end ? new Date(end) : new Date();
    const limitValue = parseInt(limit) || 2;

    const topPayingClients = await this.jobRepository.findTopPayingClients(startDate, endDate, limitValue)

    if(!topPayingClients) {
      return new Err({ status: 404, message: 'No data found' });
    }

    return new Ok(topPayingClients);
  }
}