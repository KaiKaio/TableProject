// db.js
import Dexie from 'dexie';

export const db = new Dexie('tableDatabase');
db.version(1).stores({
  tableData: 'index, info',
});
