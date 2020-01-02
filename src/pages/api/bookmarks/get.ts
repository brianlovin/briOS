import db from '~/data/firebase'

export default async (_, res) => {
  let data = []
  await db.collection('bookmarks').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const d = doc.data()
        const id = doc.id
        data.push({
          ...d,
          id: doc.id
        })
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  return res.status(200).json({ data })
};