import db from '~/data/firebase'

export default async (_, res) => {
  let data = []

  try {
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
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(200).json({ data, error })
  }

};