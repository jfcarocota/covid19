import React, {Component} from 'react';
import Chart from 'chart.js';

export default class ChartLine extends Component{

    constructor(props){
        super(props);

        this.state = {
            context: {},
            dates: [],
            cofirmeds: [],
            deaths: [],
            recovereds: []
        }

        this.canvas = React.createRef();
    }

    componentDidMount(){
        this.setState({context: this.canvas.getContext('2d')});
    }
    
    render() {

        const {dates, confirmeds, deaths, recovereds} = this.state;
        console.log(dates);
        const myChart = new Chart(this.state.context, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Casos confirmados (hasta el día de hoy)',
                    fill: false,
                    data: confirmeds,
                    backgroundColor: 'rgba(0, 0, 255, 1)',
                    borderColor: 'rgba(0, 0, 255, 255)',
                    borderWidth: 2
                },
                {
                    label: 'Fallecimientos (hasta el día de hoy)',
                    fill: false,
                    data: deaths,
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 255)',
                    borderWidth: 2
                },
                {
                label: 'Pacientes recuperados (hasta el día de hoy)',
                fill: false,
                data: recovereds,
                backgroundColor: 'rgba(0, 255, 0, 1)',
                borderColor: 'rgba(0, 255, 0, 255)',
                borderWidth: 2
                },
                {
                label: 'Casos confirmados por d�a',
                fill: false,
                data: recovereds,
                backgroundColor: 'rgba(255, 255, 0, 1)',
                borderColor: 'rgba(255, 255, 0, 255)',
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
            <canvas id="myChart" ref={c => this.canvas = c} width="400" height="400"></canvas>
        );
    }
}
