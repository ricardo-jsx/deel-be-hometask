import { Err, Ok } from "ts-results";

import { sequelize } from "~/infra/database/database";
import { ContractRepository } from "~/infra/repository/contract.repository";
import { JobRepository } from "~/infra/repository/job.repository";
import { ProfileRepository } from "~/infra/repository/profile.repository";

export class PayJob {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly contractRepository: ContractRepository
  ) {}

  async execute (userId: number, jobId: string) {
    try {
      const transaction = await sequelize.transaction();

      const job = await this.jobRepository.findUnpaidJobById(jobId, userId, transaction);
      
      if (!job)  {
        await transaction.rollback();
        return new Err({ status: 404, message: 'Job not found or already paid' });
      }

      const client = await this.profileRepository.findProfileById(userId, transaction);

      if (!client || client.balance < job.price) {
        await transaction.rollback();
        return new Err({ status: 400, message: 'Insufficient balance' });
      }

      const contractor = await this.profileRepository.findProfileById(job.Contract?.ContractorId!, transaction);

      if (!contractor) {
        await transaction.rollback();
        return new Err({ status: 404, message: 'Contractor not found' });
      }

      // Deduct the job price from the client's balance
      client.balance -= job.price;
      await this.profileRepository.updateProfile(client, transaction);

      // Add the job price to the contractor's balance
      contractor.balance += job.price;
      await this.profileRepository.updateProfile(contractor, transaction);

      // Mark the job as paid
      job.paid = true;
      job.paymentDate = new Date();
      await this.jobRepository.updateJob(job, transaction);

      // Update the contract status to terminated
      job.Contract!.status = 'terminated';
      await this.contractRepository.updateContract(job.Contract!, transaction);

      await transaction.commit();
      return new Ok({ status: 200, message: 'Job paid successfully' });
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}