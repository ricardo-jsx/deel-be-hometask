import { FindBestClientsUseCase } from '~/core/usecase/find-best-clients.usecase';
import { JobRepository } from '~/infra/repository/job.repository';
import { Job } from '~/core/models';

describe('FindBestClientsUseCase', () => {
  let jobRepository: JobRepository;
  let findBestClientsUseCase: FindBestClientsUseCase;

  beforeEach(() => {
    jobRepository = new JobRepository();
    findBestClientsUseCase = new FindBestClientsUseCase(jobRepository);
  });

  it('should return the best clients successfully', async () => {
    const start = '2023-01-01';
    const end = '2023-12-31';
    const limit = '2';

    const topPayingClients = [
      { toJSON: () => ({ total_paid: 1000, clientId: 1, firstName: 'Client', lastName: 'One'}) } as unknown as Job,
      { toJSON: () => ({ total_paid: 800, clientId: 2, firstName: 'Client', lastName: 'Two' }) } as unknown as Job,
    ];

    const topPayingClientsDto = [
      { id: 1, fullName: 'Client One', paid: 1000 },
      { id: 2, fullName: 'Client Two', paid: 800 },
    ];

    jest.spyOn(jobRepository, 'findTopPayingClients').mockResolvedValue(topPayingClients);

    const result = await findBestClientsUseCase.execute(start, end, limit);

    expect(result.ok).toBe(true);
    expect(result.val).toEqual(topPayingClientsDto);
  });

  it('should use default values if no parameters are provided', async () => {
    const start = '';
    const end = '';
    const limit = '';

    const topPayingClients = [
      { toJSON: () => ({ total_paid: 1000, clientId: 1, firstName: 'Client', lastName: 'One'}) } as unknown as Job,
    ];

    const topPayingClientsDto = [
      { id: 1, fullName: 'Client One', paid: 1000 },
    ];

    jest.spyOn(jobRepository, 'findTopPayingClients').mockResolvedValue(topPayingClients);

    const result = await findBestClientsUseCase.execute(start, end, limit);

    expect(result.ok).toBe(true);
    expect(result.val).toEqual(topPayingClientsDto);
  });

  it('should return error if no data found', async () => {
    expect.assertions(3);

    const start = '2023-01-01';
    const end = '2023-12-31';
    const limit = '2';

    jest.spyOn(jobRepository, 'findTopPayingClients').mockResolvedValue([]);

    const result = await findBestClientsUseCase.execute(start, end, limit);
    
    if ('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(404);
      expect(result.val.message).toBe('No data found');
    }
  });

  it('should return error if data parsing fails', async () => {
    expect.assertions(4);
    
    const start = '2023-01-01';
    const end = '2023-12-31';
    const limit = '2';

    const topPayingClients = [
      { toJSON: () => 'unexpected client data' } as unknown as Job,
    ];

    jest.spyOn(jobRepository, 'findTopPayingClients').mockResolvedValue(topPayingClients);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await findBestClientsUseCase.execute(start, end, limit);

    if ('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(500);
      expect(result.val.message).toBe('Internal server error');
      expect(console.error).toHaveBeenCalled();
    }
  });

  it('should return error on internal server error', async () => {
    expect.assertions(3);
    
    const start = '2023-01-01';
    const end = '2023-12-31';
    const limit = '2';

    jest.spyOn(jobRepository, 'findTopPayingClients').mockRejectedValue(new Error('Internal server error'));

    const result = await findBestClientsUseCase.execute(start, end, limit);

    if('status' in result.val) {
      expect(result.ok).toBe(false);
      expect(result.val.status).toBe(500);
      expect(result.val.message).toBe('Internal server error');
    }
  });
});