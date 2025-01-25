import { Contract } from "./contract"
import { Job } from "./job"
import { Profile } from "./profile"

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId'})
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId'})

Contract.belongsTo(Profile, {as: 'Contractor'})
Contract.belongsTo(Profile, {as: 'Client'})

Contract.hasMany(Job)
Job.belongsTo(Contract)

export { Profile, Contract, Job }