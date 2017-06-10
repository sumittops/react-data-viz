import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import PropTypes from 'prop-types';
import { max } from 'd3-array';
import { axisBottom } from 'd3-axis';
import '../bar-chart.scss';
import { Color } from '../../../core/utils';
import { select as d3Select } from 'd3-selection';


export default class HorizontalBarChart extends Component{
    constructor(props){
        super(props);
        this.barMargin = 1;
        this.state = {
            data: this.props.data.map(({key,value})=>({
                 key, value, width:0, color: '#fff'
            })),
            width: '100%'
        };
    }
    componentDidMount(){
        this.transform();
        window.addEventListener('resize',()=>this.transform());
    }
    componentWillUnmount(){
        window.removeEventListener('resize');
    }
    transform(){
        this.color = new Color();
        let maxValue = max(this.props.data.map(d=> d.value));
        let width = this.node.parentNode.getBoundingClientRect().width;
        this.scale = scaleLinear().domain([0,maxValue])
                    .range([0, width- this.props.margin.left - this.props.margin.right]);
        let data = this.props.data.map(({key,value},i)=>({
                key, value, width: this.scale(value), color: this.color.getNextColor(),
                transform:`translate(0,${i*(this.props.barHeight+ this.barMargin)})`
        }));
        this.setState({
            data, isDataReady: true, width: width- this.props.margin.left - this.props.margin.right
        });
        let translateAxis = `translate(${this.props.margin.left},${this.props.margin.top + this.props.height})`;
        if(this.props.showAxes){
            d3Select(this.node.querySelector('#x-axis')).remove();
            d3Select(this.node).append('g').attr('id','x-axis').attr('transform',translateAxis).call(axisBottom().scale(this.scale));          
        } 
    }
    showTooltip(event,index){
        try{
            const position = {
                x: event.nativeEvent.offsetX,
                y: event.nativeEvent.offsetY
            };
            let item = this.state.data[index];
            let html = (<div>
                    <b>{item.key}</b><b>:</b> <span>{item.value}</span>
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
            <svg className="default" ref={node=>this.node = node}
                height={this.props.height + this.props.margin.top + this.props.margin.bottom} 
                width={this.node?this.state.width + this.props.margin.left + this.props.margin.right:this.state.width}>
                <g transform={translateG}>
                {
                    this.state.data.map((item,i)=>
                        <g key={item.key} transform={item.transform}>
                            <text className="horizontal-bar-label" x={-2} y={this.props.barHeight/2}>{item.key}</text>
                            <rect height={this.props.barHeight} key={i} width={item.width} fill={item.color}
                                onMouseOver={(e)=>this.showTooltip(e,i)} 
                                onMouseMove={(e)=>this.showTooltip(e,i)} 
                                onMouseOut={e=>this.hideTooltip()}
                            ></rect>
                        </g>
                    )
                }
                </g>
            </svg>
        );
    }
}
HorizontalBarChart.propTypes = {
    data: PropTypes.array.isRequired,
    barHeight: PropTypes.number,
    height: PropTypes.number,
    showAxes: PropTypes.bool,
    margin: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
        bottom: PropTypes.number,
    })
}
HorizontalBarChart.defaultProps = {
    data:[], barHeight: 15, height: 300, margin:{
        left: 30, top: 15, bottom: 15, right: 10
    }, showAxes: true
}