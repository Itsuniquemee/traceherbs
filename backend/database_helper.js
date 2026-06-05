/**
 * Basic local database helper class (sqlite-style stub).
 * Intended for local development and future persistence abstraction.
 */
class DatabaseHelper {
  constructor(dbPath = 'traceherbs_local.db') {
    this.dbPath = dbPath;
  }

  async initialize() {
    return { initialized: true, dbPath: this.dbPath };
  }

  async insert(table, payload) {
    return { table, payload, status: 'queued' };
  }

  async findAll(table) {
    return { table, rows: [] };
  }
}

module.exports = DatabaseHelper;
