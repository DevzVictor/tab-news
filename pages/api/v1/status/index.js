import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const maxConnectionsResult = await database.query("SHOW max_connections;");

  const openedConnectionsResult = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: Number(maxConnectionsResult.rows[0].max_connections),
        version: databaseVersionValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
