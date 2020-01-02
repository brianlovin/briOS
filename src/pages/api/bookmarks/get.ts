import db from '~/firebase/db'

export default async (_, res) => {
  let data = []
  await db.collection('bookmarks').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        data.push(doc.data())
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  return res.status(200).json({ data })
};