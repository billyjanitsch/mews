import Base from './Base'
import Artist from './Artist'
import Album from './Album'
import bookshelf from './bookshelf'

export default Base.extend({
  tableName: 'tracks',

  artist() {
    return this.belongsTo(Artist, 'artist')
  },

  album() {
    return this.belongsTo(Album, 'album')
  },
}, {
  fromFile(track, artist, album) {
    return this.forge({...track, artist, album})
  },

  generate(track) {
    return bookshelf.transaction(transacting =>
      Artist.fromFile(track.artist).fetchOrCreate({transacting})
        .then(artist => Album.fromFile(track.album, artist.get('id'))
          .fetchOrCreate({transacting})
        )
        .then(album => this.fromFile(track, album.get('artist'), album.get('id'))
          .fetchOrCreate({transacting})
        )
    )
  },
})
