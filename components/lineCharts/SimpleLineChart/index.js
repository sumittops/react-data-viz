import React, { Component } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
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
        this.transform(this.props.data);
        window.addEventListener('resize',()=> this.transform(this.props.data));
    }
    componentWillReceiveProps(nextProps){
        this.transform(nextProps.data);
    }
    componentWillUnmount(){
        window.removeEventListener('resize');
    }
    showTooltip(e,i){
        try{
            const { top, left }= e.nativeEvent.target.getBoundingClientRect();
            const position = {
                x: left,
                y: top
            };
            const item = this.props.data[i];
            const html = (<div>
                <b>{item.x}: </b><span>{item.y}</span>
            </div>);
            this.props.tooltipUpdate(position,html);
        }catch(e){
            console.warn(e);
        }
    }
    hideTooltip(){
        this.props.tooltipUpdate(null,null);
    }
    transform(data){
        let parseTime = this.parseTime = timeParse('%Y-%m-%d');
        let chartWidth = this.node.parentNode.getBoundingClientRect().width;
        let margin = this.props.margin;
        let xScale = this.xScale = scaleLinear().domain(extent(data, d=> d.x)).range([0,chartWidth - margin.left - margin.right]);
        if(this.props.isTimeScaled){
            xScale = scaleTime().domain(extent(data, d=> parseTime(d.x))).range([0,chartWidth - margin.left - margin.right]);
        }
        let yScale = this.yScale = scaleLinear().domain(extent(data, d=> d.y)).range([this.props.height - margin.top - margin.bottom,0]);
        let lineGen = this.props.isTimeScaled?d3Line().x(d=> xScale(parseTime(d.x))).y(d=> yScale(d.y)):d3Line().x(d=> xScale(d.x)).y(d=> yScale(d.y));
        this.setState({
            pathData: lineGen(data), width: chartWidth - margin.left - margin.right,
            dots: data.map((d)=>({
                x: this.props.isTimeScaled?xScale(this.parseTime(d.x)):xScale(d.x),
                y: yScale(d.y)
            })) 
        });
        if(this.props.showAxes){
            let translateXAxis = `translate(${this.props.margin.left},${this.props.height - margin.bottom  })`;
            let translateYAxis = `translate(${this.props.margin.left},${ margin.top })`;
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
                        <path d={this.state.pathData} fill="none" stroke={this.props.lineColor} />
                        {
                            this.state.dots.map((p,i) =>
                                <circle key={i} fill={this.props.lineColor} className="dot"
                                cx={p.x} cy={p.y} r={4}
                                onClick={(e)=>this.showTooltip(e,i)} 
                                onMouseOut={e=>this.hideTooltip()}
                                ></circle>
                            )
                        }
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
    showAxes: PropTypes.bool,
    lineColor:PropTypes.string
};
SimpleLineChart.defaultProps = {
    data: [], isTimeScaled: false, margin:{
        left: 30, top: 10, bottom: 20, right: 10
    }, height: 300, showAxes: true, lineColor: '#999999'
};
