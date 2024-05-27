const knex = require('knex');

function addDefaultColumns(table) {
    table.timestamps(false, true);
}

exports.up = async function(knex) {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').notNullable().primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.boolean('is_active').defaultTo(true);
        table.integer('role_id').references('id').inTable('roles');

        addDefaultColumns(table);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('users');
};
