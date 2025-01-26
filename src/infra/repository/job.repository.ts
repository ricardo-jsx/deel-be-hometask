import { col, fn, literal, Op, Transaction } from "sequelize";
import { Contract, Job, Profile } from "~/core/models";

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

  async getHighestPaidProfessionBetweenDate(startDate: Date, endDate: Date) {
        const highestPaidProfession = await Job.findOne({
          attributes: [
            [fn('SUM', col('price')), 'total_earned'],
            [literal('"Contract->Contractor"."profession"'), 'profession']
          ],
          where: {
            paid: true,
            paymentDate: { [Op.between]: [startDate, endDate] }
          },
          group: ['Contract->Contractor.profession'],
          include: [{
            model: Contract,
            attributes: [],
            include: [{
              model: Profile,
              as: 'Contractor',
              attributes: []
            }]
          }],
          order: [[literal('total_earned'), 'DESC']],
        });

        return highestPaidProfession;
  }
}