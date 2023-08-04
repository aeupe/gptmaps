import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usePostQueryMutation } from '../redux/api'
import GoogleMapReact from 'google-map-react'
import {
  InputBase,
  FormGroup,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import { 
  Search as SearchIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material'
import { setSettings } from '../redux/settings-slice'

const MainView = () => {

    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)

    const [query, setQuery] = useState('')
    const [response, setResponse] = useState('')

    const [postQuery, { isLoading }] = usePostQueryMutation()

    const [infoWindow, setInfoWindow] = useState()
    const [places, setPlaces] = useState()

    const [map, setMap] = useState()
    const [maps, setMaps] = useState()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const [openAiApiKey, setOpenAiApiKey] = useState('')
    const [googleApiKey, setGoogleApiKey] = useState('')

    useEffect(() => {
      if ( !settings.openAiApiKey || !settings.googleApiKey ) {
        onSettingsOpen()
      }
    }, [])

    useEffect(() => {
      if ( map && maps ) {
        setInfoWindow(new maps.InfoWindow())
        setPlaces(new maps.places.PlacesService(map))
      }
    }, [map, maps])

    const onSettingsOpen = () => {
      setOpenAiApiKey(settings.openAiApiKey)
      setGoogleApiKey(settings.googleApiKey)
      setSettingsOpen(true)
    }

    const onSettingsClose = () => {
      setSettingsOpen(false)
    }

    useEffect(() => {
      if ( response ) {
        if ( window.markers ) {
          for ( const marker of window.markers ) {
            marker.setMap(null)
          }
        }
        window.markers = []
        let i = 0
        const _markers = []
        response.forEach((query, j) => {
          places.findPlaceFromQuery({
            query,
            fields: ['name', 'geometry', 'place_id'],
          // eslint-disable-next-line no-loop-func
          }, (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK) {
              const location = results[0].geometry.location
              const marker = new maps.Marker({
                position: { 
                  lat: location.lat(), 
                  lng: location.lng()
                },
                map,
                title: results[0].name,
//                label: `${j + 1}`
              })
              marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent(`
                  <span class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-18lrjg1-MuiCircularProgress-root" style="width: 16px; height: 16px;" role="progressbar"><svg class="MuiCircularProgress-svg css-1idz92c-MuiCircularProgress-svg" viewBox="22 22 44 44"><circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate css-176wh8e-MuiCircularProgress-circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle></svg></span>
                `)
                infoWindow.open(marker.getMap(), marker)
                places.getDetails({
                  placeId: results[0].place_id,
                }, (place, status) => {
                  if (status === maps.places.PlacesServiceStatus.OK) {
                    infoWindow.setContent(`
                      <div>
                        <span style="font-weight: 500; font-size: 14px;">${marker.getTitle()}</span><br />
                        <div style="margin-top: 2px; font-weight: 400; font-size: 13px;">${place.adr_address}</div>
                        <div><a style="font-weight: 400; color: #1a73e8;" href="${place.url}" target="_blank" rel="noreferrer">View on Google Maps</a></div>
                      </div>
                    `);
                  }
                })
              })
              _markers.push(marker)
            }
            i ++
            if ( i === response.length ) {
              const bounds = new maps.LatLngBounds()
              for ( const marker of _markers ) {
                bounds.extend(marker.getPosition())
              }
              map.fitBounds(bounds)
              window.markers = _markers
            }
          })
        })
      }
    }, [response])

    const defaultProps = {
      center: {
        lat: 52.132633,
        lng: 5.291266
      },
      zoom: 1
    }

    const onGoogleApiLoaded = async (map, maps) => {
      setMap(map)
      setMaps(maps)
    }

    const createMapOptions = maps => ({
        zoomControl: false,
        fullscreenControl: false,
        transitMode: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          }
        ]
      })

    return <div style={{ height: '100vh' }}>
      <div className="map-panel">
        {settings.googleApiKey
          && <GoogleMapReact
            bootstrapURLKeys={{ 
              libraries: 'places', 
              key: settings.googleApiKey || ''
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            options={createMapOptions}
            onGoogleApiLoaded={({map, maps}) => onGoogleApiLoaded(map, maps)}
            yesIWantToUseGoogleMapApiInternals
          >
          </GoogleMapReact>
        }
    </div>
    <div className="prompt-panel">
        <div style={{ display: 'flex', width: '100%', maxWidth: 960 }}>
          <form style={{ display: 'flex', flex: 1, alignItems: 'center' }} onSubmit={e => {
            const query = e.target['query'].value
            if ( !query ) {
              setResponse([])
            } else {
              postQuery({ query }).then(_ => {
                if ( _?.error ) {
                  const error = _?.error?.data?.error
                  if ( error ) alert(error)
                }
                setResponse(_?.data?.response || [])
              }).catch(err => {
                console.error(err)
                setResponse([])
              })
            }
            e.preventDefault()
          }}>

            <FormGroup row style={{ width: '100%'}} className="query-input">
              <Paper style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: 56 }}>
                <InputBase value={query}
                  disabled={isLoading}
                  name="query"
                  multiline
                  onChange={e => setQuery(e.target.value)} 
                  placeholder="Query..." 
                  variant="outlined"             
                  style={{ flex: 1, marginLeft: 12 }}
                />
                <IconButton disabled={isLoading} 
                  variant="contained"
                  type="submit" style={{ marginRight: 4 }}>
                    {
                      isLoading 
                        ? <CircularProgress style={{ width: 24, height: 24 }} /> 
                        : <SearchIcon />
                    }
                </IconButton>
                <Divider sx={{ height: 28 }} orientation="vertical" />
                <IconButton style={{ marginLeft: 4, marginRight: 4 }} disabled={isLoading} onClick={() => {
                  onSettingsOpen()
                }}>
                    <SettingsIcon />
                </IconButton>
              </Paper>
            </FormGroup>
          </form>
        </div>
      </div>
      <Dialog
        open={settingsOpen}
        onClose={onSettingsClose}
        className="settings-modal"
        fullScreen={false}
        fullWidth={true}
      >
        <DialogTitle>Settings</DialogTitle>
        <form onSubmit={e => {
          e.preventDefault()
          dispatch(setSettings({
            openAiApiKey,
            googleApiKey
          }))
          onSettingsClose()
        }}>
          <DialogContent style={{ paddingTop: 4 }}>
              <div style={{ marginTop: 6 }}></div>
              <TextField style={{ width: '100%' }} 
                required
                value={openAiApiKey} 
                onChange={e => setOpenAiApiKey(e.target.value)} 
                label="OpenAI API key" 
              />
              <div style={{ marginTop: 14 }}></div>
              <TextField style={{ width: '100%' }} 
                required
                value={googleApiKey} 
                onChange={e => setGoogleApiKey(e.target.value)} 
                label="Google API key" 
              />
              <div style={{ fontSize: '.9em', color: '#888', marginTop: 12 }}>
                Keys are used to authenticate requests to third party APIs. 
                They are stored in your browser's local storage and are not saved or logged by the server.
              </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">Save</Button>
            <Button onClick={onSettingsClose}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
}

export default MainView