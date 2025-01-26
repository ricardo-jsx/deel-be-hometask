import { Op, Transaction } from "sequelize";
import { Contract, Job } from "~/core/models";

export class JobRepository {
  async updateJob(job: Job, transaction?: Transaction) {
    await job.save({ transaction });
  }

  async findClientUnpaidJobs(clientId: number) {
    const unpaidJobs = await Job.findAll({
      where: { paid: false },
      include: [{
        model: Contract,
        where: {
          [Op.and]: [
            { status: 'in_progress' },
            { ClientId: clientId }
          ]
        }
      }]
    });

    return unpaidJobs;
  }

  async findAllUnpaidJobs(userId: number) {
    const unpaidJobs = await Job.findAll({
      where: { paid: false },
      include: [{
        model: Contract,
        where: {
          [Op.and]: [
            { status: 'in_progress' },
            {
              [Op.or]: [
                { ContractorId: userId },
                { ClientId: userId }
              ]
            }
          ]
        }
      }]
    });

    return unpaidJobs;
  }

  async findUnpaidJobById(jobId: string, clientId: number, transaction?: Transaction) {
    const job = await Job.findOne({
      where: { id: jobId, paid: false},
      include: [{
        model: Contract,
        where: {
          status: 'in_progress',
          ClientId: clientId
        }
      }],
      transaction
    });

    return job;
  }
}