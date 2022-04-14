import knex, { Knex } from 'knex';
import { Record, DBClient, Wheres, WhereFunc } from './db';
import _ from 'lodash';
import { Cursor } from '../types/trigger';
import config from './knexfile';

const recordMapper: any = {
  tracks: (tracks: any) => tracks.map((t: any) => ({ ...t, metadata: JSON.parse(t.metadata) }))
}

const loadDB = async () => {
  const currentConfig = config[process.env.NODE_ENV]
  const db = knex(currentConfig);
  await db.migrate.latest();
  return db;
}

const recordExistsFunc = (db: Knex) => async (tableName: string, recordID: string, idField: string = 'id') => {
  console.log(`Querying for record ${recordID} on ${tableName}`);
  const record = await db(tableName).where(idField, recordID)
  return !!record[0];
}

const getRecordsFunc = (db: Knex) => async <RecordType extends Record>(tableName: string, wheres?: Wheres): (Promise<RecordType[]>) => {
  console.log(`Querying for records where ${JSON.stringify(wheres)}`);
  let query = db(tableName);
  if (wheres) {
    wheres.forEach(where => {
      const queryField = where[0];
      if (queryField === 'and') {
        query = query[queryField];
      } else {
        query = (query[queryField] as any)(...where[1])
      }
    })
  }
  const records = await query;
  if (recordMapper[tableName]) {
    return recordMapper[tableName](records);
  }
  return records;
}

const init = async (): Promise<DBClient> => {
  const db = await loadDB();
  return ({
    getCursor: async (processor: string): Promise<(string | undefined)> => {
      console.log(`Querying for processor cursor`);
      const cursorResult = await db('processors').where('id', processor).select('cursor');
      return cursorResult[0]?.cursor;
    },
    recordExists: recordExistsFunc(db),
    insert: async (tableName: string, records: Record[]) => {
      console.log(`Inserting into ${tableName} ${records.length} records`);
      if (records.length === 0) {
        return;
      }
      await db(tableName).insert(records);
    },
    updateProcessor: async (processor: string, lastCursor: Cursor) => {
      console.log(`Updating ${processor} with cursor: ${lastCursor}`);
      const processorExists = await recordExistsFunc(db)('processors', processor);
      if (processorExists) {
        await db('processors').where('id', processor).update(
          { cursor: lastCursor }
        );
      } else {
        await db('processors').insert(
          { id: processor, cursor: lastCursor }
        );
      }
    },
    getNumberRecords: async (tableName: string) => {
      console.log(`Querying for count on ${tableName}`);
      const count = await db(tableName).count({ count: '*' })
      return count[0].count;
    },
    getRecords: getRecordsFunc(db),
    update: async (tableName: string, recordUpdates: Record[], idField: string = 'id') => {
      console.log(`Updating records`);
      if (recordUpdates?.length > 0) {
        for (const update of recordUpdates) {
          const id = update.id;
          const changes: any = { ...update }
          delete changes.id
          await db(tableName).where(idField, id).update(changes)
        }
      }
    },
    delete: async (tableName: string, ids: string[], idField: string = 'id') => {
      console.log(`Deleting records`);
      if (ids?.length > 0) {
        await db(tableName).whereIn(idField, ids).delete()
      }
    },
    upsert: async (tableName: string, recordUpserts: Record[], idField: string | string[] = 'id') => {
      console.log(`Upserting records`);
      if (recordUpserts?.length > 0) {
        for (const upsert of recordUpserts) {
          await db(tableName)
            .insert(upsert)
            .onConflict(idField as any)
            .merge()
        }
      }
    },
    close: async () => {
      return await db.destroy();
    }
  });
}

export default {
  init
};

/*

const init = async (): Promise<DBClient> => {
  let { db, indexes } = await loadDB();
  return {
    getFullDB: async () => {
      return { db, indexes };
    }
  };
}

export default {
  init
};

*/