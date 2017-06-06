import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import { max } from 'd3-array';

import '../bar-chart.scss';
import { Color } from '../../../core/utils';

export default class HorizontalBarChart extends Component{
    constructor(props){
        super(props);
        this.barMargin = 1;
        this.margin = 10;
        this.state = {
            data: this.props.data.map(({key,value})=>({
                 key, value, width:0, color: '#fff'
            })),
            width: '100%'
        };
    }
    componentDidUpdate (){
        window.addEventListener('resize',()=>this.onResize());
    }
    componentDidMount(){
        this.transform();
    }
    componentWillUnmount(){
        window.removeEventListener('resize');
    }
    transform(){
        if(this.props.data && this.props.data.length){
            this.color = new Color();
            let maxValue = max(this.props.data.map(d=> d.value));
            let width = this.node.parentNode.getBoundingClientRect().width;
            this.scale = scaleLinear().domain([0,maxValue])
                        .range([0,width- 2*this.margin]);
            let data = this.props.data.map(({key,value})=>({
                 key, value, width: this.scale(value), color: this.color.getNextColor()
            }));
            this.setState({
                data, isDataReady: true, width: width - 2 * this.margin
            });
        }
    }
    onResize(){
        if(this.node){
            this.transform();
        }
    }
    render(){
        return (
            <svg className="default" ref={node=>this.node = node} height={this.props.height} width={this.state.width}>
                {
                    this.state.data.map((item,i)=>
                        <g key={item.key}>
                            <rect y={i*(this.props.barHeight+ this.barMargin)} height={this.props.barHeight} key={i} width={item.width} fill={item.color}></rect>
                        </g>
                    )
                }
            </svg>
        );
    }
}
HorizontalBarChart.propTypes = {
    data: PropTypes.array.isRequired,
    barHeight: PropTypes.number,
    height: PropTypes.number
}
HorizontalBarChart.defaultProps = {
    data:[], barHeight: 15, height: 300
}