const knex = require('knex');

function addDefaultColumns(table) {
    table.timestamps(false, true);
}

exports.up = async function(knex) {
    await knex.schema.createTable('projects', (table) => {
        table.increments('id').notNullable().primary();
        table.string('name', 255).notNullable().unique();
        table.string('description', 255).notNullable();
        table.date('deadline');
        table.integer('under_user').unsigned().references('id').inTable('users').onDelete('CASCADE');
        addDefaultColumns(table);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('projects');
};
