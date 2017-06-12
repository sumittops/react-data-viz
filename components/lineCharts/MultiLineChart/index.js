import React, { Component } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { timeParse } from 'd3-time-format';
import PropTypes from 'prop-types';
import { min, max } from 'd3-array';
import { axisBottom, axisLeft, axisRight } from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { line as d3Line, interpolate } from 'd3-shape';
import { Color } from '../../../core/utils';
import '../line-chart.scss';
export default class MultiLineChart extends Component {
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
    transform(data){
        var lineGen,
            color = new Color(),
            chartWidth = this.node.parentNode.getBoundingClientRect().width,
            margin = this.props.margin,xMin,xMax,xScale,yScale;
        var parseTime = timeParse("%Y-%m-%d");
        var yMin = min(data, d=> min(d.values, d1 => d1.y ));
        var yMax = max(data, d=> max(d.values, d1 => d1.y ));
        if(this.props.isTimeScaled){
            xMin = min(data, d=> min(d.values, d1 => parseTime(d1.x) ));
            xMax = max(data, d=> max(d.values, d1 => parseTime(d1.x) ));
            xScale = this.xScale = scaleTime().domain([xMin,xMax]).range([0,chartWidth - margin.left - margin.right]);
            yScale = this.yScale = scaleLinear().domain([yMin, yMax]).range([this.props.height - margin.top - margin.bottom,0]);
            lineGen = d3Line().x(d=> xScale(parseTime(d.x))).y(d=> yScale(d.y));
        }else{
            xMin = min(data, d=> min(d.values, d1 => d1.x ));
            xMax = max(data, d=> max(d.values, d1 => d1.x ));
            xScale = this.xScale = scaleLinear().domain([xMin, xMax]).range([0,chartWidth - margin.left - margin.right]);
            yScale = this.yScale = scaleLinear().domain([yMin, yMax]).range([this.props.height - margin.top - margin.bottom,0]);
            lineGen = d3Line().x(d=> xScale(d.x)).y(d=> yScale(d.y));
        }
        this.setState({
            pathData: data.map(d=>{
                let nextColor = color.getNextColor();
                let item = {
                    key: d.key, 
                    values: d.values, 
                    dots: d.values.map(({x,y})=>({
                        x: this.props.isTimeScaled?xScale(parseTime(x)):xScale(x), y: yScale(y), color: nextColor
                    })),
                    path: lineGen(d.values),
                    style: {
                        stroke:nextColor
                    },
                    legendStyle:{
                        backgroundColor:nextColor
                    },
                    isActive: d.isActive || true
                };
                return item;
            }), width: chartWidth - margin.left - margin.right 
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
    showTooltip(event, index){
        try{
            const {top, left }= event.nativeEvent.target.getBoundingClientRect();
            const position = {
                x: left,
                y: top
            };
            let items = this.state.pathData.filter(d=>d.isActive).map((d,i)=>
                <div key={i}><b>{d.key}</b><b>:</b> <span>{d.values[index].y}</span></div>
            );
            let html = (<div>
                    { items }
                </div>);
            this.props.tooltipUpdate(position,html);
        }catch(e){
            console.warn(e);
        }
    }
    hideTooltip(){
        this.props.tooltipUpdate(null,null);   
    }
    render(){
        let translateG = `translate(${this.props.margin.left},${this.props.margin.top})`;
        return (
            <div>
                { this.state.pathData &&
                    <div className="legend-box">
                    { this.state.pathData.map(d=>
                        <div key={d.key} className="legend-item">
                            <div className="legend-rect" style={d.legendStyle}></div>
                            <div className="legend-text">{d.key}</div>  
                        </div>
                    )
                    }
                    </div>
                }
                <svg ref={node=> this.node = node} 
                    height={this.props.height + this.props.margin.top + this.props.margin.bottom} 
                    width={this.node?this.state.width + this.props.margin.left + this.props.margin.right:this.state.width}>
                    {   this.state.pathData && 
                        <g transform={translateG}>
                            {
                                this.state.pathData.map(d=>
                                    <g key={d.key}>
                                        <path className="line" fill="none" style={d.style} d={d.path}></path>
                                        { d.dots.map((item,i) =>
                                            <circle className="dot"  key={i} fill={item.color} cx={item.x} cy={item.y} r={4}
                                                onClick={(e)=>this.showTooltip(e,i)}
                                                onMouseOut={e=>this.hideTooltip()}
                                            ></circle>
                                            )
                                        }
                                    </g>
                                )
                            }
                        </g>
                    }
                </svg>
            </div>
        )
    }
}
MultiLineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.any.isRequired, values: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.any.isRequired, y: PropTypes.number.isRequired
        })).isRequired
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
    interpolate: PropTypes.string
};
MultiLineChart.defaultProps = {
    data: [], isTimeScaled: false, margin:{
        left: 30, top: 10, bottom: 20, right: 10
    }, height: 300, showAxes: true, interpolate: 'basis'
};
