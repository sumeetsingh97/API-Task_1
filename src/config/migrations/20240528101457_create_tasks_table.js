const knex = require('knex');

function addDefaultColumns(table) {
    table.timestamps(false, true);
}

exports.up = async function(knex) {
    await knex.schema.createTable('tasks', (table) => {
        table.increments('id').notNullable().primary();
        table.string('title', 255).notNullable();
        table.string('description', 255).notNullable();
        table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE');
        table.integer('assigned_to').unsigned().references('id').inTable('users').onDelete('SET NULL');
        table.string('status').defaultTo('To Do');
        table.date('due_date');
        addDefaultColumns(table);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('tasks');
};
