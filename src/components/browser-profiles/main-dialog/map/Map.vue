<template>
  <div
    id="map"
    style="width: 600px !important;height: 400px !important;"
  />
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Map',
  data: () => ({
    marker: new window.mapboxgl.Marker(),
    map: undefined
  }),
  computed: {
    ...mapFields('browserProfiles', ['browserProfile'])
  },
  watch: {
    'browserProfile.geolocation': {
      handler: function (n, o) {
        const lngLat = {
          lng: n.longitude,
          lat: n.latitude
        }
        console.log(lngLat)
        this.addMarker({ lngLat: lngLat })
      },
      deep: 'true'
    }
  },
  beforeMount () {
  },
  mounted () {
    window.mapboxgl.accessToken = 'pk.eyJ1IjoiZG9scGhpbjAwNyIsImEiOiJjbDFkcG5xZDAwM2Q5M2VydGt1bnN3bTY2In0.wQr4iIu_XZHH9qjmVjuQbg'
    this.initMap()
    /* Given a query in the form "lng, lat" or "lat, lng"
     * returns the matching geographic coordinate(s)
     * as search results in carmen geojson format,
     * https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */
    this.setMapGeocoder()
    // Add the control to the map.
    const nav = new window.mapboxgl.NavigationControl()
    this.map.addControl(nav, 'top-right')

    this.setGeolocateControl()
    // init listener to marker
    this.map.on('click', (e) => {
      this.addMarker(e)
    })
    // hack to getCurrentPosition
    this.setCurrentPosition()

    // this.map.on('idle', function () {
    //   this.map.resize()
    // })
  },
  destroyed () {
    this.map.remove()
  },
  methods: {
    getCurrentPosition () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          this.map.center = [position.coords.latitude, position.coords.longitude]
          this.browserProfile.geolocation.longitude = position.coords.longitude
          this.browserProfile.geolocation.latitude = position.coords.latitude
          this.addMarker({ lngLat: { lat: position.coords.latitude, lng: position.coords.longitude } })
        })
      }
    },
    addMarker (event) {
      console.log(event)
      const coordinates = event.lngLat
      this.marker.setLngLat(coordinates).addTo(this.map)
      const test = document.querySelector('.mapboxgl-ctrl-geocoder--input')
      test.value = +event.lngLat.lat + ', ' + +event.lngLat.lng
      this.browserProfile.geolocation.longitude = event.lngLat.lng
      this.browserProfile.geolocation.latitude = event.lngLat.lat
      this.coordinatesGeocoder(+event.lngLat.lat + ', ' + +event.lngLat.lng)
      this.setCameraPosition(event.lngLat)
    },
    setCameraPosition (lngLat) {
      const camera = this.map.getFreeCameraOptions()

      const position = [lngLat.lng, lngLat.lat]
      const altitude = 1000000

      camera.position = window.mapboxgl.MercatorCoordinate.fromLngLat(position, altitude)
      camera.lookAtPoint([lngLat.lng, lngLat.lat])

      this.map.setFreeCameraOptions(camera)
    },
    coordinatesGeocoder (query) {
      // Match anything which looks like
      // decimal degrees coordinate pair.
      const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      )
      if (!matches) {
        return null
      }

      function coordinateFeature (lng, lat) {
        return {
          center: [lng, lat],
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          place_name: 'Lat: ' + lat + ' Lng: ' + lng,
          place_type: ['coordinate'],
          properties: {},
          type: 'Feature'
        }
      }

      const coord1 = Number(matches[1])
      const coord2 = Number(matches[2])
      const geocodes = []

      if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature.call(this, coord1, coord2))
        this.browserProfile.geolocation.latitude = coord1
        this.browserProfile.geolocation.longitude = coord2
      }

      if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature.call(this, coord2, coord1))
        this.browserProfile.geolocation.latitude = coord1
        this.browserProfile.geolocation.longitude = coord2
      }

      if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature.call(this, coord1, coord2))
        geocodes.push(coordinateFeature.call(this, coord2, coord1))
        this.browserProfile.geolocation.latitude = coord1
        this.browserProfile.geolocation.longitude = coord2
      }

      return geocodes
    },
    // map
    initMap () {
      this.map = new window.mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.4512, 43.6568],
        zoom: 8,
        trackUserLocation: true
      })
    },
    setMapGeocoder () {
      const mbGeo = new window.MapboxGeocoder({
        accessToken: window.mapboxgl.accessToken,
        localGeocoder: this.coordinatesGeocoder,
        zoom: 4,
        placeholder: this.$t('common.map.placeholder'),
        mapboxgl: window.mapboxgl,
        reverseGeocode: true
      })
      this.map.addControl(mbGeo)
    },
    setGeolocateControl () {
      this.map.addControl(new window.mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        // showUserLocation: true
      }))
    },
    setCurrentPosition () {
      setTimeout(() => {
        const mapBoxGeolocateBtn = document.querySelector('.mapboxgl-ctrl-geolocate')
        mapBoxGeolocateBtn.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }))
        this.getCurrentPosition()
      }, 300)
    }
  }

}
</script>

<style lang="scss">
#map {
  width: 100% !important;
  height: 100% !important;
}
//.mapboxgl-canvas-container {
//  height: 400px;
//}
//.mapboxgl-canvas{
//  height: 400px !important;
//  width: 100% !important;
//}
.mapboxgl-ctrl-top-right{
  width: 100%;
  //display: none;
}
.mapboxgl-ctrl-geocoder{
  width: 100% !important;
}
@media screen and (min-width: 640px){
  .mapboxgl-ctrl-geocoder {
    width: 100% !important;
    max-width: 500px;
  }
}
#map .mapboxgl-ctrl-attrib.mapboxgl-compact .mapboxgl-ctrl-attrib-button{
  display: none !important;
}
</style>
