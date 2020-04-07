import React, {Component, Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component{

  constructor(props){
    super(props)

    this.state = {
      url: 'https://pomber.github.io/covid19/timeseries.json',
      date: new Date() - 1,
      data: {}
    }
  }

  componentDidMount() {
    const {url} = this.state;
    /*const response =  fetch(this.state.url);
    const data =  response.json();
    const todayData = data.Mexico[data.Mexico.length - 1];
    console.log(todayData);
    this.setState({data: todayData});*/
    fetch(url).then(res => res.json()).then(json => this.setState({data: json.Mexico[json.Mexico.length - 1]}));
  }

  shouldComponentUpdate(nextProps){
    return this.state.data !== nextProps.data;
  }

  render() {
    const {data} = this.state;
    const {date, confirmed, deaths, recovered} = data;
    console.log(this.state.data);
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
                <footer>Datos tomados de "The Center for Systems Science and Engineering (CSSE) at JHU", public api: https://github.com/pomber/covid19</footer>
              </div>
            </div>
  
          </div>
       </Fragment>
    );
  }
}
