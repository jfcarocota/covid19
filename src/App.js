import React, {Component, Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js';
import Map from './components/Map';

export default class App extends Component{

  constructor(props){
    super(props)

    this.state = {
      url: 'https://pomber.github.io/covid19/timeseries.json',
      data: {},
      context: '',
      arr: []
    }
    this.canvas = React.createRef();

  }

  componentDidMount() {
    const {url} = this.state;
    fetch(url).then(res => res.json()).then(json => this.setState({
      data: json.Mexico[json.Mexico.length - 1],
      arr: json.Mexico
    }));
    this.setState({context: this.canvas.getContext('2d')});
  }

  render() {
    const {data, arr} = this.state;
    const {date, confirmed, deaths, recovered} = data;
    //console.log(this.state);

    const arr_cofirmed = arr.map(e =>{
      return e.confirmed;
    });



    const arr_cofirmed_per_day = [];

    for(let i = 0; i < arr_cofirmed.length; i++){
      if(i > 0){
        arr_cofirmed_per_day.push(arr_cofirmed[i] - arr_cofirmed[i - 1]);
      }
    }

    const arr_dates = arr.map(e =>{
      return e.date;
    });

    const arr_deaths = arr.map(e =>{
      return e.deaths;
    });

    const arr_deaths_per_day = [];

    for(let i = 0; i < arr_deaths.length; i++){
      if(i > 0){
        arr_deaths_per_day.push(arr_deaths[i] - arr_deaths[i - 1]);
      }
    }

    const arr_recovereds = arr.map(e =>{
      return e.recovered;
    });
    
    const arr_recovereds_per_day = [];

    for(let i = 0; i < arr_recovereds.length; i++){
      if(i > 0){
        arr_recovereds_per_day.push(arr_recovereds[i] - arr_recovereds[i - 1]);
      }
    }


    const myChart = new Chart(this.state.context, {
      type: 'line',
      data: {
          labels: arr_dates,
          datasets: [{
              label: 'Casos confirmados (hasta el día de hoy)',
              fill: false,
              data: arr_cofirmed,
              backgroundColor: 'rgba(0, 0, 255, 1)',
              borderColor: 'rgba(0, 0, 255, 255)',
              borderWidth: 2
          },
          {
            label: 'Fallecimientos (hasta el día de hoy)',
            fill: false,
            data: arr_deaths,
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(255, 0, 0, 255)',
            borderWidth: 2
        },
        {
          label: 'Pacientes recuperados (hasta el día de hoy)',
          fill: false,
          data: arr_recovereds,
          backgroundColor: 'rgba(0, 255, 0, 1)',
          borderColor: 'rgba(0, 255, 0, 255)',
          borderWidth: 2
      },
      {
        label: 'Casos confirmados por día',
        fill: false,
        data: arr_cofirmed_per_day,
        backgroundColor: 'rgba(255, 0, 255, 1)',
        borderColor: 'rgba(255, 0, 255, 255)',
        borderWidth: 2
      },
      {
        label: 'Muertes por día',
        fill: false,
        data: arr_deaths_per_day,
        backgroundColor: 'rgba(150, 0, 100, 1)',
        borderColor: 'rgba(150, 0, 100, 255)',
        borderWidth: 2
      },
      {
        label: 'Pacientes recuperados por día',
        fill: false,
        data: arr_recovereds_per_day,
        backgroundColor: 'rgba(0, 150, 100, 1)',
        borderColor: 'rgba(0, 150, 100, 255)',
        borderWidth: 2
    }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });

    return (
       <Fragment>

          <div className="container">
          <h1>Covid19 México</h1>
          <div className="row">
            
              <div className="col text-center">
                <div className="display-1">{date}</div>
                <div className="text-secondary"><strong>Fecha del último reporte</strong></div>
                <div className="display-1">{confirmed}</div>
                <div className="text-secondary"><strong>Casos confirmados</strong></div>
                <div className="display-1">{deaths}</div>
                <div className="text-secondary"><strong>Fallecimientos</strong></div>
                <div className="display-1">{recovered}</div>
                <div className="text-secondary"><strong>Pacientes recuperados</strong></div>
                <br/>
                <strong>Has click en los botones de colores para ver u ocultar las graficas</strong>
                <canvas id="myChart" ref={c => this.canvas = c} width="400" height="400"></canvas>
                <br/>
                <h1>Covid19 en el mundo</h1>
                <Map/>
                <br/>
                <footer>Datos tomados de "The Center for Systems Science and Engineering (CSSE) at JHU", public api: https://github.com/pomber/covid19</footer>
              </div>
            </div>
  
          </div>
       </Fragment>
    );
  }
}
