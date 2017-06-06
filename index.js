import React from 'react';
import ReactDOM from 'react-dom';

import Palette from './core/Palette';
import HorizontalBarChart from './components/barCharts/HorizontalBarChart';
import VerticalBarChart from './components/barCharts/VerticalBarChart';
import SimpleLineChart from './components/lineCharts/SimpleLineChart';

const fakeData = [{ key:'blood', value: 121 },{ key:'argon',  value: 112 },
    { key: 'novel', value: 31 }, { key: 'sixtytwo', value: 76 }];
const superFake = ()=>{
    let fake = [];
    for(let i = 0; i < 10; i++){
        fake =  [...fake, {
            x: i, y: parseFloat(Math.random()*100)
        }]
    }
    return fake;
}
const horizontalChartMargin = {
    left: 50, top: 10, bottom: 20, right: 10
};
class App extends React.Component{
    constructor(){
        super();
        this.state = {
            data: superFake()
        };
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
