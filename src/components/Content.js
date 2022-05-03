/* eslint-disable prettier/prettier */
/** @jsx jsx */
import React, { useCallback, useContext, useState } from 'react'
import { css, jsx } from '@emotion/core'
import { StoreContext } from './index'

import Modal from './Modal'
import Toast from './Toast'

const Content = () => {
  const { state, dispatch } = useContext(StoreContext)

  const [toast, setToast] = useState('')
  const [playlistSelect, setPlayListSelect] = useState('')
  const [playVisibleId, setPlayVisibleId] = useState(
    false
  )

  const currentPlaylist = state.currentPlaylist

  const playlists = Object.keys(state.playlists).filter(
    list => !['home', 'favorites'].includes(list)
  )
  const songIds = Array.from(
    state.playlists[currentPlaylist]
  )

  const handleSelect = useCallback(e => {
    setPlayListSelect(e.target.value)
  })

  return (
    <div className="Content" css={CSS}>
      <div className="playlist-title">
        {currentPlaylist}
      </div>

      {songIds.length <= 0 ? (
        <p style={{ marginTop: 10 }}>
          Your playlist is empty. Start by adding some
          songs!
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <td />
              <td>Título</td>
              <td>Álbum</td>
              <td>Artista/Banda</td>
              <td>Ano</td>
              <td>Tempo</td>
              <td>Avaliações</td>
            </tr>
          </thead>

          <tbody>
            {songIds.map(id => {
              const {
                titulo,
                album,
                artista,
                ano,
                length,
                avaliacao
              } = state.media[id]
              const isFavorite = state.playlists.favoritos.has(
                id
              )

              return (
                <tr key={id}>
                  <td
                    onMouseEnter={() =>
                      setPlayVisibleId(id)
                    }
                    onMouseLeave={() =>
                      setPlayVisibleId('')
                    }
                    style={{ width: 75, paddingLeft: 5 }}
                  >
                    <PlayPause
                      playing={state.playing}
                      songId={id}
                      isCurrentSong={
                        state.currentSongId === id
                      }
                      visible={playVisibleId === id}
                    />

                    <span style={{ marginRight: 10 }} />

                    <Favorite
                      isFavorite={isFavorite}
                      songId={id}
                    />

                    <span style={{ marginRight: 10 }} />

                    <i
                      className="fa fa-plus"
                      onClick={() => {
                        dispatch({
                          type: 'ADD_TO_PLAYLIST',
                          songId: id
                        })
                      }}
                    />
                  </td>
                  <td>{titulo}</td>
                  <td>{album}</td>
                  <td>{artista}</td>
                  <td>{ano}</td>
                  <td>{length}</td>
                  <td>{avaliacao}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <Modal
        show={state.addToPlaylistId}
        close={() => {
          dispatch({ type: 'ABORT_ADD_TO_PLAYLIST' })
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 20 }}>
            Add To Playlist
          </div>

          {playlists.length < 1 ? (
            <>
              <p>
                You don't have any custom playlists yet.
                Start by creating one in the sidebar menu!
              </p>

              <div style={{ marginTop: 15 }}>
                <button>Ok</button>
              </div>
            </>
          ) : (
            <>
              <select
                value={playlistSelect}
                onChange={handleSelect}
                style={{
                  fontSize: 16,
                  textTransform: 'capitalize',
                  width: 115,
                  height: 25
                }}
              >
                <option value="">Choose</option>

                {playlists.map(list => (
                  <option
                    key={list}
                    value={list}
                    disabled={state.playlists[list].has(
                      state.addToPlaylistId
                    )}
                  >
                    {list}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => {
                    if (playlistSelect === '') return
                    
                    dispatch({
                      type: 'SAVE_TO_PLAYLIST',
                      playlist: playlistSelect
                    })

                    setToast(
                      'Successfully added to your playlist.'
                    )

                    setPlayListSelect('')
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <Toast toast={toast} close={() => setToast('')} />
    </div>
  )
}

const Favorite = ({ isFavorite, songId }) => {
  const { dispatch } = useContext(StoreContext)

  return isFavorite ? (
    <i
      className="fa fa-heart"
      onClick={() => dispatch({ type: 'REMOVE_FAVORITE', songId })}
    />
  ) : (
    <i
      className="fa fa-heart-o"
      onClick={() => dispatch({ type: 'ADD_FAVORITE', songId })}
    />
  )
}

const PlayPause = ({ playing, songId, isCurrentSong, visible }) => {
  const { dispatch } = useContext(StoreContext)
  const style = { visibility: visible ? 'visible' : 'hidden' }

  if (isCurrentSong && playing) {
    return (
      <i
        className="fa fa-pause"
        onClick={() => dispatch({ type: 'PAUSE' })}
        style={style}
      />
    )
  } else {
    return (
      <i
        className="fa fa-play"
        onClick={() => dispatch({ type: 'PLAY', songId })}
        style={style}
      />
    )
  }
}

const CSS = css`
  width: calc(100% - 200px);
  height: calc(100% - 75px);
  padding: 20px;
  background: #121212;
  padding-top: 70px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 15px;
  }

  ::-webkit-scrollbar-thumb {
    background: #282828;
  }

  .playlist-title {
    font-size: 20px;
    text-transform: capitalize;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 15px;
    font-size: initial;
  }

  table tr {
    border-bottom: 1px solid #282828;
  }

  table td {
    padding: 10px 0;
  }

  i {
    cursor: pointer;
  }

  button {
    background-color: #2bcc6c;
    color: white;
    padding: 12.5px 30px;
    border-radius: 25px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 13px;
    border: none;
    cursor: pointer;
  }
`

export default Content
