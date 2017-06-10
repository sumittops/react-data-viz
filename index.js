import React from 'react';
import ReactDOM from 'react-dom';

import Palette from './core/Palette';
import HorizontalBarChart from './components/barCharts/HorizontalBarChart';
import VerticalBarChart from './components/barCharts/VerticalBarChart';
import SimpleLineChart from './components/lineCharts/SimpleLineChart';
import MultiLineChart from './components/lineCharts/MultiLineChart';
import Tooltip from './core/Tooltip';
import * as jsonData from './demo/dateData.json';
const fakeData = [{ key:'blood', value: 121 },{ key:'argon',  value: 112 },
    { key: 'novel', value: 31 }, { key: 'sixtytwo', value: 76 }];
var offset = 0;
const superFake = ()=>{
    let fake = [];
    for(let i = 0; i < 10; i++){
        fake =  [...fake, {
            x: jsonData[i].x,
            y: jsonData[i+offset].y
        }]
    }
    offset += 10;
    return fake.sort((a,b)=> new Date(a.x) - new Date(b.x));
};
const superFake2 = ()=>{
    let fake = [];
    for(let i = 0; i < 5; i++){
        fake =  [...fake, {
            key: i, values: superFake()
        }]
    }
    return fake;
};
const horizontalChartMargin = {
    left: 50, top: 10, bottom: 20, right: 10
};
export default class App extends React.Component{
    constructor(){
        super();
        this.state = {
            data: superFake(),
            data2: superFake2(),
            tooltipData: null,
            tooltipPosition:{
                x: -1, y: -1
            }
        };
        this.tooltipUpdate = this.tooltipUpdate.bind(this);
    }
    tooltipUpdate(position,content){
        this.setState({
            tooltipPosition:position||{x:-1,y:-1},
            tooltipData: content
        });
    }
    render(){
        return (
            <div>
                <HorizontalBarChart barHeight={25} data={fakeData} height={110} 
                    margin={horizontalChartMargin} tooltipUpdate={this.tooltipUpdate}/>
                <VerticalBarChart data={fakeData}  tooltipUpdate={this.tooltipUpdate} barWidth={25} height={300} />
                <SimpleLineChart isTimeScaled={true} data={this.state.data}  tooltipUpdate={this.tooltipUpdate} lineColor={'#009688'}></SimpleLineChart>
                <MultiLineChart isTimeScaled={true} data={this.state.data2}  tooltipUpdate={this.tooltipUpdate}></MultiLineChart>

                <Tooltip position={this.state.tooltipPosition} content={this.state.tooltipData}/>
            </div>
        );
    }
}
ReactDOM.render(
    <App/>, document.getElementById('root')
);
