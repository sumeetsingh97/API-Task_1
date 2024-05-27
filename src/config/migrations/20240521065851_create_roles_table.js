const knex = require('knex');

function addDefaultColumns(table) {
    table.timestamps(false, true);
}

exports.up = async function(knex) {
    await knex.schema.createTable('roles', (table) => {
        table.increments('id').notNullable().primary();
        table.string('name', 255).notNullable().unique();

        addDefaultColumns(table);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('roles');
};
