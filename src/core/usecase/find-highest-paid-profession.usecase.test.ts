import { FindHighestPaidProfessionUseCase } from '~/core/usecase/find-highest-paid-profession.usecase';
import { JobRepository } from '~/infra/repository/job.repository';

describe('FindHighestPaidProfessionUseCase', () => {
  let jobRepository: JobRepository;
  let findHighestPaidProfessionUseCase: FindHighestPaidProfessionUseCase;

  beforeEach(() => {
    jobRepository = new JobRepository();
    findHighestPaidProfessionUseCase = new FindHighestPaidProfessionUseCase(jobRepository);
  });

  it('should return the highest paid profession successfully', async () => {
    const start = '2023-01-01';
    const end = '2023-12-31';

    const highestPaidProfession = {
      toJSON: () => ({ profession: 'Programmer', total_earned: 5000 }),
    } as unknown as any;

    const highestPaidProfessionDto = { profession: 'Programmer', totalEarned: 5000 };

    jest.spyOn(jobRepository, 'getHighestPaidProfessionBetweenDate').mockResolvedValue(highestPaidProfession);

    const result = await findHighestPaidProfessionUseCase.execute(start, end);

    expect(result.ok).toBe(true);
    expect(result.val).toEqual(highestPaidProfessionDto);
  });

  it('should return error if no data found', async () => {
    expect.assertions(3);
    
    const start = '2023-01-01';
    const end = '2023-12-31';

    jest.spyOn(jobRepository, 'getHighestPaidProfessionBetweenDate').mockResolvedValue(null);

    const result = await findHighestPaidProfessionUseCase.execute(start, end);

    if('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(404);
      expect(result.val.message).toBe('No data found');
    }
  });

  it('should return error if data is invalid', async () => {
    expect.assertions(4);
    
    const start = '2023-01-01';
    const end = '2023-12-31';

    const highestPaidProfession = { toJSON: () => 'invalid data' } as unknown as any;

    jest.spyOn(jobRepository, 'getHighestPaidProfessionBetweenDate').mockResolvedValue(highestPaidProfession);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await findHighestPaidProfessionUseCase.execute(start, end);

    if('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(500);
      expect(result.val.message).toBe('Internal server error');
      expect(console.error).toHaveBeenCalled();
    }
  })

  it('should use default values if no parameters are provided', async () => {
    const start = '';
    const end = '';

    const highestPaidProfession = {
      toJSON: () => ({ profession: 'Programmer', total_earned: 5000 }),
    } as unknown as any;

    const highestPaidProfessionDto = { profession: 'Programmer', totalEarned: 5000 };

    jest.spyOn(jobRepository, 'getHighestPaidProfessionBetweenDate').mockResolvedValue(highestPaidProfession);

    const result = await findHighestPaidProfessionUseCase.execute(start, end);

    expect(result.ok).toBe(true);
    expect(result.val).toEqual(highestPaidProfessionDto);
  });

  it('should return error on internal server error', async () => {
    expect.assertions(3);
    
    const start = '2023-01-01';
    const end = '2023-12-31';

    jest.spyOn(jobRepository, 'getHighestPaidProfessionBetweenDate').mockRejectedValue(new Error('Internal server error'));

    const result = await findHighestPaidProfessionUseCase.execute(start, end);

    if('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(500);
      expect(result.val.message).toBe('Internal server error');
    }
  });
});