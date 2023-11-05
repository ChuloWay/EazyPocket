import { Knex } from 'knex';

/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex: Knex): Promise<void> {
  // Create 'users' table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('email').unique();
    table.string('password');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create 'wallets' table
  await knex.schema.createTable('wallets', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.float('balance');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create 'transactions' table
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().references('id').inTable('wallets');
    table.integer('receiver_id').unsigned().references('id').inTable('wallets');
    table.float('amount');
    table.enum('type', ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']);
    table.string('description'); // New 'description' column
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param {Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex: Knex): Promise<void> {
  // Drop the tables in reverse order
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('wallets');
  await knex.schema.dropTableIfExists('users');
}
