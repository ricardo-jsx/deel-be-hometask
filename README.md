# DEEL BACKEND TASK

💫 Welcome! 🎉

This backend exercise involves building a Node.js/Express.js app that will serve a REST API.

## Data Models

### Profile

A profile can be either a `client` or a `contractor`.  
Clients create contracts with contractors, while contractors perform jobs for clients and get paid.  
Each profile has a balance property.

### Contract

A contract exists between a client and a contractor.  
Contracts have 3 statuses: `new`, `in_progress`, and `terminated`.  
Contracts are considered active only when in the `in_progress` status.  
Contracts group jobs within them.

### Job

Contractors get paid for jobs performed under a certain contract by clients.

## Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by creating a local repository for this folder.
2. In the repo's root directory, run `npm install` to install all dependencies.
3. Next, run `npm run seed` to seed the local SQLite database. **Warning: This will drop the database if it exists**. The database will be stored in a local file named `database.sqlite3`.
4. Then run `npm start` to start the server.

## APIs

Below is a list of the required APIs for the application.

1. **_GET_** `/contracts/:id` - Returns the contract only if it belongs to the profile making the request.
2. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor). The list should only contain non-terminated contracts.
3. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (either a client or contractor), but only for active contracts.
4. **_POST_** `/jobs/:job_id/pay` - Pay for a job. A client can only pay if their balance is greater than or equal to the amount due. The payment amount should be moved from the client's balance to the contractor's balance.
5. **_POST_** `/balances/deposit/:userId` - Deposit money into a client's balance. A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
6. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contractor who worked within the specified time range.
7. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - Returns the clients who paid the most for jobs within the specified time period. The `limit` query parameter should be applied, and the default limit is 2.

## Example Requests

### Get contract by ID
```http
curl -X GET "http://localhost:3001/contracts/1" \
  -H "Accept: application/json" \
  -H "profile_id: 1"
```

### Get ongoing contracts
```http
curl -X GET "http://localhost:3001/contracts" \
  -H "Accept: application/json" \
  -H "profile_id: 6"
```

### Get unpaid jobs
```http
curl -X GET "http://localhost:3001/jobs/unpaid" \
  -H "Accept: application/json" \
  -H "profile_id: 6"
```

### Pay for a job
```http
curl -X POST "http://localhost:3001/jobs/3/pay" \
  -H "Accept: application/json" \
  -H "profile_id: 2" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

### Deposit balance for a user
```http
curl -X POST "http://localhost:3001/balances/deposit/2" \
  -H "Accept: application/json" \
  -H "profile_id: 2" \
  -H "Content-Type: application/json" \
  -d '{"amount": 40}'
```

### Get best profession
```http
curl -X GET "http://localhost:3001/admin/best-profession?start=2019-01-01&end=2023-12-31" \
  -H "Accept: application/json" \
  -H "profile_id: 1"
```

### Get best clients
```http
curl -X GET "http://localhost:3001/admin/best-clients?start=2019-01-01&end=2023-12-31&limit=5" \
  -H "Accept: application/json" \
  -H "profile_id: 1"
```