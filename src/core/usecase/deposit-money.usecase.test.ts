import { Job } from '~/core/models/job';
import { Profile } from '~/core/models/profile';
import { DepositMoneyUseCase } from '~/core/usecase/deposit-money.usecase';
import { JobRepository } from '~/infra/repository/job.repository';
import { ProfileRepository } from '~/infra/repository/profile.repository';

describe('DepositMoneyUseCase', () => {
  let profileRepository: ProfileRepository;
  let jobRepository: JobRepository;
  let depositMoneyUseCase: DepositMoneyUseCase;

  beforeEach(() => {
    profileRepository = new ProfileRepository();
    jobRepository = new JobRepository();
    depositMoneyUseCase = new DepositMoneyUseCase(profileRepository, jobRepository);
  });

  it('should deposit money successfully', async () => {
    const userId = 1;
    const amount = 50;
    const client = new Profile();
    client.id = userId;
    client.balance = 100;

    const unpaidJobs: Job[] = [
      { price: 100 } as Job,
      { price: 100 } as Job,
    ];

    jest.spyOn(jobRepository, 'findClientUnpaidJobs').mockResolvedValue(unpaidJobs);
    jest.spyOn(profileRepository, 'findProfileById').mockResolvedValue(client);
    jest.spyOn(profileRepository, 'updateProfile').mockResolvedValue();

    const result = await depositMoneyUseCase.execute(userId, amount);

    expect(result.ok).toBe(true);
    expect(result.val.message).toBe('Deposit successful');
    expect(client.balance).toBe(150);
  });

  it('should return error if no unpaid jobs found', async () => {
    const userId = 1;
    const amount = 50;

    jest.spyOn(jobRepository, 'findClientUnpaidJobs').mockResolvedValue([]);

    const result = await depositMoneyUseCase.execute(userId, amount);

    expect(result.ok).toBe(false);
    expect(result.val.status).toBe(200);
    expect(result.val.message).toBe('No unpaid jobs found');
  });

  it('should return error if client not found', async () => {
    const userId = 1;
    const amount = 50;

    const unpaidJobs: Job[] = [
      { price: 100 } as Job,
      { price: 100 } as Job,
    ];

    jest.spyOn(jobRepository, 'findClientUnpaidJobs').mockResolvedValue(unpaidJobs);
    jest.spyOn(profileRepository, 'findProfileById').mockResolvedValue(null);

    const result = await depositMoneyUseCase.execute(userId, amount);

    expect(result.ok).toBe(false);
    expect(result.val.status).toBe(404);
    expect(result.val.message).toBe('Client not found');
  });

  it('should return error if deposit amount exceeds 25% of pending payments', async () => {
    const userId = 1;
    const amount = 100;
    const client = new Profile();
    client.id = userId;
    client.balance = 100;

    const unpaidJobs: Job[] = [
      { price: 100 } as Job,
      { price: 100 } as Job,
    ];

    jest.spyOn(jobRepository, 'findClientUnpaidJobs').mockResolvedValue(unpaidJobs);
    jest.spyOn(profileRepository, 'findProfileById').mockResolvedValue(client);

    const result = await depositMoneyUseCase.execute(userId, amount);

    expect(result.ok).toBe(false);
    expect(result.val.status).toBe(400);
    expect(result.val.message).toBe('Deposit amount exceeds 25% of pending payments');
  });

  it('should return error on internal server error', async () => {
    const userId = 1;
    const amount = 50;

    jest.spyOn(jobRepository, 'findClientUnpaidJobs').mockRejectedValue(new Error('Internal server error'));

    const result = await depositMoneyUseCase.execute(userId, amount);

    expect(result.ok).toBe(false);
    expect(result.val.status).toBe(500);
    expect(result.val.message).toBe('Internal server error');
  });
});