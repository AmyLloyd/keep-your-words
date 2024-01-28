import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

export const putDb = async (content) => {
  //store connection to the database in variable called jateDb
  const jateDb = await openDB('jate', 1);
  //create new transaction that expects database name and privileges
  const tx = jateDb.transaction('jate', 'readwrite');
  //create a variable that will hold the reference to the object store
  const store = tx.objectStore('jate');
  //add method on object store and pass in content
  const request = store.put({ id: 1, value: content });
  //the result confirms the transaction
  const result = await request;
  console.log('Data updated in the jate database', result);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {

  const jateDb = await openDB('jate', 1);

  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  
  const request = store.get(1);
  const result = await request;
  console.log('All content from database', result);
  console.dir(result);
  return result?.value

}

initdb();
