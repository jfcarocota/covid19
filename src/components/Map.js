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
            zoom: 4.60,
            data: []
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
                const {confirmed, deaths, recovered} = stats;
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

            console.log(points);
        });

        console.log(this.state.data);

    }

    render() {

        return (
             <div className="mapContainer">
                <div className="mapBox" ref={e => this.mapContainer  = e} />
            </div>
        );
    }
}