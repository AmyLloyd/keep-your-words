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

// export const postDb = async (content) => {
//   //store connection to the database in variable called jateDb
//   const jateDb = await openDB('jate', 1);
//   //create new transaction that expects database name and privileges
//   const tx = jateDb.transaction('jate', 'readwrite');
//   //create a variable that will hold the reference to the object store
//   const store = tx.objectStore('jate');
//   //add method on object store and pass in content
//   const request = store.add({ jate: content });
//   //the result confirms the transaction
//   const result = await request;
//   console.log('Data saved to the database', result);
// };

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  //store connection to the database in variable called jateDb
  const jateDb = await openDB('jate', 1);
  //create new transaction that expects database name and privileges
  const tx = jateDb.transaction('jate', 'readwrite');
  //create a variable that will hold the reference to the object store
  const store = tx.objectStore('jate');
  //add method on object store and pass in content
  const request = store.put({ jate: content });
  //the result confirms the transaction
  const result = await request;
  console.log('Data updated in the jate database', result);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {

  const jateDb = await openDB('jate', 1);
  const result = await jateDb.getAll('jate');
  console.log('All content from database', result);
  console.dir(result);

}

initdb();
