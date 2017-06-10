import React, { Component } from 'react';
import './tooltip.scss';
import PropTypes from 'prop-types';
export default function Tooltip(props){
    const className  = props.content?'tooltip':'tooltip hidden';
    const style = {
        top: props.position.y, left: props.position.x,
    };
    return(
        <div style={style} className={className}>
            {props.content}
        </div>
    )
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