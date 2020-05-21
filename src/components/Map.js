import React, {Component, useRef, createRef} from 'react';
import mapboxgl from "mapbox-gl";
import useSWR from "swr"; // React hook to fetch the data
import lookup from "country-code-lookup"; // npm module to get ISO Code for countries
import "mapbox-gl/dist/mapbox-gl.css";
import './map.scss'

mapboxgl.accessToken = 'pk.eyJ1IjoiamZjYXJvY290YSIsImEiOiJjazhzYnV2Z3YwNWVnM2xtdGIwOWs4bTl3In0.FdaOCRNbW03t4j1PaJyqIg';

export default class Map extends Component{

    constructor(props){
        super(props);

        this.mapboxElRef = createRef();

        this.state = {
            lng: -102.10232,
            lat: 23.68367,
            zoom: 3.60,
        }
    }

    componentDidMount(){
        const url = 'https://corona.lmao.ninja/v2/jhucsse';

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        fetch(url).then(r => r.json()).then(data => {
            
            const points = data.map((point, index) =>{
                //console.log(country);
                const {stats, coordinates, province, country} = point;
                const {latitude, longitude} = coordinates;
                const {confirmed, deaths} = stats;
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            longitude,
                            latitude
                        ]
                    },
                    properties: {
                        id: index, // unique identifier in this case the index
                        country: country,
                        province: province,
                        cases: confirmed,
                        deaths: deaths
                    }
                } 
            });

            map.once('load', ()=>{
                map.addSource("points", {
                    type: "geojson",
                    data: {
                      type: "FeatureCollection",
                      features: points
                    }
                });

                map.addLayer({
                    id: "circles",
                    source: "points", // this should be the id of the source
                    type: "circle",
                    // paint properties
                    paint: {
                        "circle-opacity": 0.75,
                        "circle-stroke-width": 1,
                        "circle-stroke-width": [
                            "interpolate",
                            ["linear"],
                            ["get", "cases"],
                            1, 1,
                            100000, 1.75,
                        ],
                        "circle-radius": 4,
                        "circle-color": "#FFEB3B",
                        "circle-color": [
                            "interpolate",
                            ["linear"],
                            ["get", "cases"],
                            1, '#ffffb2',
                            5000, '#fed976',
                            10000, '#feb24c',
                            25000, '#fd8d3c',
                            50000, '#fc4e2a',
                            75000, '#e31a1c',
                            100000, '#b10026'
                        ],
                        "circle-radius": [
                            "interpolate",
                            ["linear"],
                            ["get", "cases"],
                            1, 4,
                            1000, 8,
                            4000, 10,
                            8000, 14,
                            12000, 18,
                            100000, 40
                        ]
                    }
                });
            });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            let lastId;

            map.on("mousemove", "circles", e => {
                // Get the id from the properties
                const id = e.features[0].properties.id;
              
                // Only if the id are different we process the tooltip
                if (id !== lastId) {
                  lastId = id;
              
                  // Change the pointer type on move move
                  map.getCanvas().style.cursor = "pointer";
              
                  const { cases, deaths, country, province } = e.features[0].properties;
                  const coordinates = e.features[0].geometry.coordinates.slice();
              
                  // Get all data for the tooltip
                  const countryISO =
                    lookup.byCountry(country)?.iso2 || lookup.byInternet(country)?.iso2;
              
                  const provinceHTML =
                    province !== "null" ? `<p>Province: <b>${province}</b></p>` : "";
              
                  const mortalityRate = ((deaths / cases) * 100).toFixed(2);
              
                  const countryFlagHTML = Boolean(countryISO)
                    ? `<img src="https://www.countryflags.io/${countryISO}/flat/64.png"></img>`
                    : "";
              
                  const HTML = `<p>País: <b>${country}</b></p>
                            ${provinceHTML}
                            <p>Casos: <b>${cases}</b></p>
                            <p>Muertes: <b>${deaths}</b></p>
                            <p>Tasa de mortalidad: <b>${mortalityRate}%</b></p>
                            ${countryFlagHTML}`;
              
                  // Ensure that if the map is zoomed out such that multiple
                  // copies of the feature are visible, the popup appears
                  // over the copy being pointed to.
                  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                  }
              
                  popup
                    .setLngLat(coordinates)
                    .setHTML(HTML)
                    .addTo(map);
                }
            });

            map.on("mouseleave", "circles", function() {
                // Reset the last Id
                lastId = undefined;
                map.getCanvas().style.cursor = "";
                popup.remove();
            });


            //console.log(points);
        });
    }

    render() {

        return (
             <div className="mapContainer">
                <div className="mapBox" ref={e => this.mapContainer  = e} />
            </div>
        );
    }
}