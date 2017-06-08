import React from 'react';
import ReactDOM from 'react-dom';

import Palette from './core/Palette';
import HorizontalBarChart from './components/barCharts/HorizontalBarChart';
import VerticalBarChart from './components/barCharts/VerticalBarChart';
import SimpleLineChart from './components/lineCharts/SimpleLineChart';
import MultiLineChart from './components/lineCharts/MultiLineChart';
import Tooltip from './core/Tooltip';
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
const superFake2 = ()=>{
    let fake = [];
    for(let i = 0; i < 10; i++){
        fake =  [...fake, {
            key: i, values: superFake()
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
            data: superFake(),
            data2: superFake2(),
            tooltipData: null
        };
        this.tooltipUpdate = this.tooltipUpdate.bind(this);
    }
    tooltipUpdate(content){
        this.setState({
            tooltipData: content
        });
    }
    render(){
        return (
            <div>
                <HorizontalBarChart barHeight={25} data={fakeData} height={110} 
                    margin={horizontalChartMargin} tooltipUpdate={this.tooltipUpdate}/>
                <VerticalBarChart data={fakeData}  tooltipUpdate={this.tooltipUpdate} barWidth={25} height={300} />
                <SimpleLineChart data={this.state.data}  tooltipUpdate={this.tooltipUpdate} lineColor={'#009688'}></SimpleLineChart>
                <MultiLineChart data={this.state.data2}  tooltipUpdate={this.tooltipUpdate}></MultiLineChart>
                <Tooltip content={this.state.tooltipData}/>
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
