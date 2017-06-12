import React, { Component } from 'react';
import './tooltip.scss';
import PropTypes from 'prop-types';
export default class Tooltip extends Component{
    constructor(props){
        super(props);
        this.state = {
            offsetX: 0,
            repositioned:false
        };
    }
    render(){
        const props = this.props;
        const className  = props.content?'tooltip':'tooltip hidden';
        const style = {
            top: props.position.y, left: props.position.x + this.state.offsetX,
        };
        return(
            <div ref={n => this.node = n} style={style} className={className}>
                {props.content}
            </div>
        )   
    }
    componentWillReceiveProps(next){
        if(next.content)
            this.setState({
                repositioned:false
            });
    }
    componentDidUpdate(){
        const windowWidth = window.innerWidth;
        const tooltipWidth = this.node.clientWidth;
        if(!this.state.repositioned && this.props.position.x > -1 && this.props.position.x > windowWidth/2){
            this.setState({
                offsetX: -tooltipWidth,
                repositioned: true
            });
        }else if(!this.state.repositioned && this.props.position.x > -1 && this.props.position.x < windowWidth/2){
            this.setState({
                offsetX: 10,
                repositioned: true
            });
        }
    }
}
Tooltip.propTypes = {
    content:PropTypes.object,
    position:PropTypes.shape({
        x: PropTypes.number.isRequired, y: PropTypes.number.isRequired
    })
}
Tooltip.defaultProps = {
    content: <div></div>
};