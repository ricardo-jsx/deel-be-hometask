import { Op } from "sequelize";
import { Err, Ok } from "ts-results";

import { Contract, Job, Profile } from "~/core/models";
import { sequelize } from "~/infra/database/database";

export class PayJob {
  static async execute (userId: number, jobId: string) {
    try {
      const transaction = await sequelize.transaction();
      
      // Find unpaid job and include the associated ongoing contract
      const job = await Job.findOne({
        where: {
          id: jobId,
          paid: false
        },
        include: [{
          model: Contract,
          where: {
            status: 'in_progress',
            ClientId: userId
          }
        }],
        transaction
      });

      if (!job)  {
        await transaction.rollback();
        return new Err({ status: 404, message: 'Job not found or already paid' });
      }

      // Find the client profile
      const client = await Profile.findOne({
        where: { id: userId },
        transaction
      });

      if (!client || client.balance < job.price) {
        await transaction.rollback();
        return new Err({ status: 400, message: 'Insufficient balance' });
      }

      // Find the contractor profile
      const contractor = await Profile.findOne({
        where: { id: job.Contract?.ContractorId },
        transaction
      });

      if (!contractor) {
        await transaction.rollback();
        return new Err({ status: 404, message: 'Contractor not found' });
      }

      // Deduct the job price from the client's balance
      client.balance -= job.price;
      await client.save({ transaction });

      // Add the job price to the contractor's balance
      contractor.balance += job.price;
      await contractor.save({ transaction });

      // Mark the job as paid
      job.paid = true;
      job.paymentDate = new Date();
      await job.save({ transaction });

      // Update the contract status to terminated
      job.Contract!.status = 'terminated';
      await job.Contract!.save({ transaction });

      await transaction.commit();
      return new Ok({ status: 200, message: 'Job paid successfully' });
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}