import React from 'react';
import ReactDOM from 'react-dom';

import Palette from './core/Palette';
import HorizontalBarChart from './components/barCharts/HorizontalBarChart';
import VerticalBarChart from './components/barCharts/VerticalBarChart';
const fakeData = [{ key:'blood', value: 121 },{ key:'argon',  value: 112 },
    { key: 'novel', value: 31 }, { key: 'sixtytwo', value: 76 }];
const horizontalChartMargin = {
    left: 50, top: 10, bottom: 20, right: 10
};
class App extends React.Component{
    render(){
        return (
            <div>
                <HorizontalBarChart barHeight={25} data={fakeData} height={110} 
                    margin={horizontalChartMargin}/>
                <VerticalBarChart data={fakeData} barWidth={25} height={300} />
            </div>
        );
    }
}
ReactDOM.render(
    <App/>, document.getElementById('root')
);

export default {
    Palette, HorizontalBarChart, VerticalBarChart
};
