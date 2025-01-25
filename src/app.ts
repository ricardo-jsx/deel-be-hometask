import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sequelize } from '~/infra/database/database';
import { getProfile } from './middleware/getProfile';
import { ContractsController } from './controller/contracts.controller';

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.get('/contracts/:id', getProfile, ContractsController.getContractById);

export default app;