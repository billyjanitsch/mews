import {createReadStream} from 'fs'
import mm from 'musicmetadata'

const split = d => d.length && d[0]

const transform = (metadata, file) => ({
  file,
  title: metadata.title,
  artist: split(metadata.albumartist),
  album: metadata.album,
  number: metadata.track.no,
  disc: metadata.disk.no,
  // year: metadata.year.substr(0, 4),
})

export default file =>
  new Promise((resolve, reject) => {
    mm(createReadStream(file), (error, metadata) => {
      if (error) reject(error)
      else resolve(transform(metadata, file))
    })
  })
