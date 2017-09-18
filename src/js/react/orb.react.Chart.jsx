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
      typeof this.props.chartMode.type === 'string';
  },
  drawChart: function() {
    if(this.canRender()) {
      var chartData = this.props.pivotTableComp.pgridwidget.pgrid.getChartData();

      var chart = c3.generate({ // eslint-disable-line no-unused-vars
        bindto: ReactDOM.findDOMNode(this),
        data:{
          type: 'bar',
          columns: chartData.dataTable
        }
      });
    }
  },
  componentDidMount: function() {
    this.drawChart();
  },
  componentDidUpdate: function() {
    this.drawChart();
  },
  render: function() {
    if(this.canRender()) {
      return <div className="chart" style={this.state.chartStyle}></div>;
    }
    return null;
  }
});