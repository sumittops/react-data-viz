import React, { Component } from 'react';
import './tooltip.scss';

export default class Tooltip extends  Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        };
    }

    render(){
        const className = this.state.visible?'tooltip':'tooltip hidden';
        return(
            <div className={className}>
                {this.props.content}
            </div>
        )
    }
}
