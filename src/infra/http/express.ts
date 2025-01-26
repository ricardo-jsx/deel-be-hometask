import bodyParser from 'body-parser';
import express from 'express';

import { ClientBalanceController } from '~/controller/client-balance.controller';
import { ContractsController } from '~/controller/contracts.controller';
import { JobsController } from '~/controller/jobs.controller';
import { sequelize } from '~/infra/database/database';
import { getProfile } from '~/middleware/getProfile';

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, ContractsController.getContractById);
app.get('/contracts', getProfile, ContractsController.getOngoingContracts);

app.get('/jobs/unpaid', getProfile, JobsController.getUnpaidJobs);
app.post('/jobs/:job_id/pay', getProfile, JobsController.payJob);

app.post('/balances/deposit/:userId', getProfile, ClientBalanceController.depositMoney);

export default app;