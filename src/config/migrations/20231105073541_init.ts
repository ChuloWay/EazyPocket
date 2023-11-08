import { Knex } from 'knex';

/**
 * Run the database migrations to create tables for users, wallets, and transactions.
 * @param {Knex} knex - The Knex instance for database schema operations.
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('firstName');
    table.string('lastName');
    table.string('email').unique().notNullable();
    table.string('phoneNumber').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('wallets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('userId').references('id').inTable('users');
    table.float('balance').defaultTo(0);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('senderId').references('id').inTable('wallets');
    table.uuid('receiverId').references('id').inTable('wallets');
    table.float('amount').defaultTo(0);
    table.enum('type', ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CREDIT']).notNullable();
    table.string('description');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

/**
 * Rollback the database migrations to drop the 'users', 'wallets', and 'transactions' tables.
 * @param {Knex} knex - The Knex instance for database schema operations.
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('users');
}
