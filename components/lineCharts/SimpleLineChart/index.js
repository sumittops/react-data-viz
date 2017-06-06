import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import { Color } from '../../../core/utils';
import '../line-chart.scss';
export default class SimpleLineChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            width: '100%',
            pathData: null,
        };
    }
    componentDidMount(){
        this.transform();
    }
    componentDidUpdate(){
        window.addEventListener('resize',()=> this.transform());
    }
    componentWillUnmount(){
        window.removeEventListener('resize');
    }
    transform(){
        let chartWidth = this.node.parentNode.getBoundingClientRect().width;
        let margin = this.props.margin;
        let xScale = scaleLinear().domain(extent(this.props.data, d=> d.x)).range([0,chartWidth - margin.left - margin.right]);
        let yScale = scaleLinear().domain(extent(this.props.data, d=> d.y)).range([0,this.props.height - margin.top - margin.bottom ]);
        let lineGen = d3Line().x(d=> xScale(d.x)).y(d=> yScale(d.y));
        this.setState({
            pathData: lineGen(this.props.data), width:chartWidth - margin.left - margin.right 
        });
        if(this.props.showAxes){
            let translateXAxis = `translate(${this.props.margin.left},${this.props.margin.top + this.props.height})`;
            let translateYAxis = `translate(${this.props.margin.left},${this.props.margin.top })`;
            d3Select(this.node.querySelector('#x-axis')).remove();
            d3Select(this.node.querySelector('#y-axis')).remove();
            d3Select(this.node).append('g').attr('id','x-axis').attr('transform',translateXAxis).call(axisBottom().scale(xScale));
            d3Select(this.node).append('g').attr('id','y-axis').attr('transform',translateYAxis).call(axisLeft().scale(yScale));
        }
    }
    render(){
        let translateG = `translate(${this.props.margin.left},${this.props.margin.top})`;
        return (
            <svg ref={node=> this.node = node} 
                height={this.props.height + this.props.margin.top + this.props.margin.bottom} 
                width={this.node?this.state.width + this.props.margin.left + this.props.margin.right:this.state.width}>
                {   this.state.pathData && 
                    <g transform={translateG}>
                        <path d={this.state.pathData} fill="none" stroke="#999" />
                    </g>
                }
            </svg>
        )
    }
}
SimpleLineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.any.isRequired, y: PropTypes.number.isRequired
    })).isRequired,
    isTimeScaled: PropTypes.bool,
    height:PropTypes.number,
    margin: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number,
    }),
    showAxes: PropTypes.bool
};
SimpleLineChart.defaultProps = {
    data: [], isTimeScaled: false, margin:{
        left: 30, top: 10, bottom: 20, right: 10
    }, height: 300, showAxes: true
};
