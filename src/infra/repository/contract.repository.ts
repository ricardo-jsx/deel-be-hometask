import { Op, Transaction } from "sequelize";

import { Contract } from "~/core/models";

export class ContractRepository {
  async updateContract(contract: Contract, transaction?: Transaction) {
    await contract.save({ transaction});
  }

  async findContractById(contractId: string, userId: number) {
    const contract = await Contract.findOne({
      where: {
        id: contractId,
        [Op.or]: [
          { ContractorId: userId },
          { ClientId: userId }
        ]
      }
    });

    return contract;
  }

  async findAllOngoingContracts(userId: number) {
    const contracts = await Contract.findAll({
      where: {
        status: { [Op.not]: 'terminated'},
        [Op.or]: [
          { ContractorId: userId },
          { ClientId: userId }
        ]
      }
    })

    return contracts;
  }
}