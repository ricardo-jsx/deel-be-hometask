import { Err, Ok } from "ts-results";
import { JobRepository } from "~/infra/repository/job.repository";
import { ProfileRepository } from "~/infra/repository/profile.repository";

export class DepositMoneyUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(userId: number, amount: number) {
    try {
      const unpaidJobs = await this.jobRepository.findClientUnpaidJobs(userId);

      if (!unpaidJobs) {
        return new Err({ status: 200, message: 'No unpaid jobs found' });
      }

      const pendingAmount = unpaidJobs.reduce((acc, job) => acc + job.price, 0);
      const maximumDeposit = pendingAmount * 0.25;

      if(amount > maximumDeposit) {
        return new Err({ status: 400, message: 'Deposit amount exceeds 25% of pending payments' });
      }

      const client = await this.profileRepository.findProfileById(userId);

      if (!client) {
        return new Err({ status: 404, message: 'Client not found' });
      }

      client.balance += amount;

      await this.profileRepository.updateProfile(client)

      return new Ok({ status: 200, message: 'Deposit successful' });
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}