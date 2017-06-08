import React from 'react';
import App from '../index';
import { shallow } from 'enzyme';
describe('App',()=>{
    it('should be able to run tests',()=>{
        expect(1+2).toEqual(3);
    });
    it('should render 1 <App/> component',()=>{
        const component = shallow(<App />);
        expect(component).toHaveLength(1);
    });

});