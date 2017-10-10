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
      this.props.chartMode.type == 'bar';
  },
  drawChart: function() {
    var self = this;
    if(this.canRender()) {
      var chartData = self.props.pivotTableComp.pgridwidget.pgrid.getChartData();
      var dataAxes = chartData.primaryValues.reduce(function(map,name) {map[name]='y'; return map;}, {});
      chartData.secondaryValues.forEach(function(name) { dataAxes[name] = chartData.y2.show ? 'y2' : 'y';});
      var chart = c3.generate({ // eslint-disable-line no-unused-vars
        bindto: ReactDOM.findDOMNode(this),
        data:{
          type: self.props.chartMode.type,
          columns: chartData.dataTable,
          types: chartData.secondaryValues.reduce(function(map,value) { map[value] = self.props.chartMode.secondaryType; return map; }, {}),
          groups: [ chartData.stackedBars ? chartData.primaryValues : [] ],
          colors: chartData.colors,
          axes: dataAxes
        },                
        axis: {
          x: {
              label: chartData.hAxisLabel,
              type: 'category', // this needed to load string x value
              categories: chartData.colNames
          },
          y2: chartData.y2
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