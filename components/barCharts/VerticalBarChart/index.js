import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import { max } from 'd3-array';

import { Color } from '../../../core/utils';
import '../bar-chart.scss';
export default class VerticalBarChart extends Component{
    constructor(props){
        super(props);
        this.barMargin = 1;
        this.margin = 10;
        this.state = {
            data: this.props.data.map(({key,value})=>({key,value, height:0, color: '#fff'})),
            width: '100%'
        };
    }
    componentDidMount(){
        this.transform();
    }
    transform(){
        let width = this.node.parentNode.getBoundingClientRect().width;
        this.color = new Color();
        let maxValue = max(this.props.data.map(d=> d.value));
        this.scale = scaleLinear().domain([0,maxValue]).range([0, this.props.height - 2 * this.margin]);
        this.setState({
            width: width - 2 * this.margin,
            data: this.props.data.map((d,i)=> ({
                key: d.key, value: d.value, height: this.scale(d.value), color: this.color.getNextColor(),
                transform: `translate(${i * (this.props.barWidth + this.barMargin)},${this.props.height - this.scale(d.value)})`
            })),
            isDataReady:true
        });
    }
    render(){
        return (
            <svg className="default" ref={node=> this.node = node} height={this.props.height} width={this.state.width}>
                { 
                    this.state.data.map((d,i)=>
                        <g key={i} transform={d.transform}>
                            <rect fill={d.color} width={this.props.barWidth} height={d.height}></rect>-
                        </g>
                    )
                }
            </svg>
        )
    }
}
VerticalBarChart.propTypes = {
    data: PropTypes.array.isRequired,
    barWidth: PropTypes.number,
    height: PropTypes.number
};
VerticalBarChart.defaultProps = {
    data:[], barWidth: 15, height: 300
};
