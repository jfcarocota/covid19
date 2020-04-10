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

    const arr_dates = arr.map(e =>{
      return e.date;
    });

    const arr_deaths = arr.map(e =>{
      return e.deaths;
    });

    const arr_recovereds = arr.map(e =>{
      return e.recovered;
    });
    


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
