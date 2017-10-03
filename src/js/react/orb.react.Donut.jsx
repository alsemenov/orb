/* global module, require, React */ // eslint-disable-line no-unused-vars

'use strict';

var React = typeof window === 'undefined' ? require('react') : window.React,
    ReactDOM = typeof window === 'undefined' ? require('react-dom') : window.ReactDOM,
    c3 = typeof window === 'undefined' ? require('c3') : window.c3;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      canRender: false
    };
  },
  canRender: function() {
    return this.state.canRender &&
      this.props.chartMode.type == 'donut';
  },
  drawDonut: function() {
    var self = this;
    if(this.canRender()) {
      var index = self.props.index;
      var donutData = self.props.pivotTableComp.pgridwidget.pgrid.getDonutData(index);

        c3.generate({ // eslint-disable-line no-unused-vars
          bindto: ReactDOM.findDOMNode(this),
          data:{
            type: self.props.chartMode.type,
            columns: donutData.data
          },        
          donut: {
            title: donutData.title
          }
        });
      }
  },
  componentDidMount: function() {
    this.drawDonut();
  },
  componentDidUpdate: function() {
    this.drawDonut();
  },
  render: function() {
    if(this.canRender()) {
      return <div className="chart" style={this.state.donutStyle}></div>;
    }
    return null;
  }
});