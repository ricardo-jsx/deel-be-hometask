import sequelize from "sequelize";
import { Op } from "sequelize";
import { Err, Ok } from "ts-results";

import { Contract, Job } from "~/core/models";

export class GetUnpaidJobs {
  static async execute (userId: number) {
    try {
      const unpaidJobs = await Job.findAll({
        where: {
          paid: false,
        },
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

      if(!unpaidJobs.length) {
        return new Err({ status: 200, message: `No unpaid jobs found` });
      }

      return new Ok(unpaidJobs);
    } catch (error) {
      console.error(error);
      return new Err({ status: 500, message: `Internal server error` });
    }
  }
}