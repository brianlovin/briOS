import fs from 'fs'

export async function useLocalFiles({ path, fetch }) {
  const fullPath = `./src/data/local/${path}.json`
  try {
    const localData = fs.readFileSync(fullPath, 'utf8')
    if (localData) return JSON.parse(localData)
    throw new Error()
  } catch (err) {
    // file doesn't exist, create it
    const data = await fetch()
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8')
    const localData = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(localData)
  }
}
