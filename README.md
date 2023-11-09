# Welcome to Demo Credit Backend Project!

## Introduction

Demo Credit is a fintech project designed for efficient loan management. This comprehensive README will assist you in setting up the project, understanding its structure, and exploring the API.

### Assessment Details

- [View the assessment requirements](/task.md)

## Project Overview

## Features

1. **Account Creation**

   - Users can create an account.

2. **Funding**

   - Users can fund their wallet accounts.

3. **Funds Transfer**

   - Users can transfer funds to another user's wallet.

4. **Withdrawal**
   - Users can withdraw funds from their own wallet.

## Implementation Details

The project is implemented using NodeJS, TypeScript, and KnexJS ORM for database interactions. The chosen database is MySQL.

### Entity Relation Diagram

![ERD Diagram](https://raw.githubusercontent.com/ChuloWay/Lendsqr-demo-credit-wallet/main/src/utils/assets/erd.png)

## Getting Started

### Prerequisites

Ensure the following packages are installed locally:

1. [MySQL](https://dev.mysql.com/downloads/installer/)
2. [Node (LTS Version)](https://nodejs.org)
3. [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. NestJS CLI: `npm install nestcli -g`

### Setup Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/ChuloWay/Lendsqr-demo-credit-wallet
   ```

2. **Create an env file:**

   - Duplicate the `.env.example` file in the project root.
   - Rename the duplicated file to `.env`.
   - Open the `.env` file and set your variables as shown in the example file.

   ```bash
   cp .env.example .env
   ```

   Ensure to fill in the necessary values in the `.env` file for a smooth configuration.

3. **Run migration:**

   ```bash
   npm run migrate:latest
   ```

4. **Start your server:**

   ```bash
   npm run start:dev
   ```

## API Documentation

Explore the API documentation at - [API Postman Documentation](https://documenter.getpostman.com/view/25293109/2s9YXiZgtX)s.

## Testing

### Unit Testing

Unit tests cover positive and negative test scenarios to ensure robust functionality.

Test the API endpoints using Postman. Additionally, you can run specific Jest tests for each service.

### User Service And Controller

Run the following command to test the User Service:

```bash
npx jest --testPathPattern=users.service.spec.ts
```

```bash
npx jest --testPathPattern=users.controller.spec.ts
```

### Auth Service And Controller

Run the following command to test the Auth Functionalities:

```bash
npx jest --testPathPattern=auth.service.spec.ts
```

```bash
npx jest --testPathPattern=auth.controller.spec.ts
```

### Wallet Service And Controller

Run the following command to test the Wallet Functionalities:

```bash
npx jest --testPathPattern=wallet.service.spec.ts
```

```bash
npx jest --testPathPattern=wallet.controller.spec.ts
```

## Deployment

The Live Backend API is hosted on Render.

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to:

- NestJS
- TypeScript
- MySQL
- Knex ORM
- JSON Web Tokens
- PostMan

## Conclusion

This MVP wallet service demonstrates competence in code quality, attention to detail, and application of best practices in design and architecture. The README documentation provides comprehensive information for developers to understand the project.
