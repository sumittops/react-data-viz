import React from 'react';
import ReactDOM from 'react-dom';

import Palette from './core/Palette';
import HorizontalBarChart from './components/barCharts/HorizontalBarChart';
import VerticalBarChart from './components/barCharts/VerticalBarChart';
import SimpleLineChart from './components/lineCharts/SimpleLineChart';

const fakeData = [{ key:'blood', value: 121 },{ key:'argon',  value: 112 },
    { key: 'novel', value: 31 }, { key: 'sixtytwo', value: 76 }];
const superFake = [{ x: 1, y: 190},
    { x: 2, y: 120 }, { x: 2, y: 10}, { x: 3, y: 80} , { x: 5, y: 120}, { x: 6, y: 92}
];
const horizontalChartMargin = {
    left: 50, top: 10, bottom: 20, right: 10
};
class App extends React.Component{
    constructor(){
        super();
        this.state = {
            data: superFake
        };
    }
    componentDidMount(){
        let x = 7;
        let interval = setInterval(function(){
            this.setState({
                data: [...this.state.data, { x:x++ , y: Math.random()*100}]
            })
            if(x > 20)
                clearInterval(interval)
        }.bind(this)
        ,1000);
    }
    render(){
        return (
            <div>
                <HorizontalBarChart barHeight={25} data={fakeData} height={110} 
                    margin={horizontalChartMargin}/>
                <VerticalBarChart data={fakeData} barWidth={25} height={300} />
                <SimpleLineChart data={this.state.data} lineColor={'#003388'}></SimpleLineChart>
            </div>
        );
    }
}
ReactDOM.render(
    <App/>, document.getElementById('root')
);

export default {
    Palette, HorizontalBarChart, VerticalBarChart, SimpleLineChart
};
