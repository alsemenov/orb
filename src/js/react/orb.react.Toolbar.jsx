/* global module, require, react */ // eslint-disable-line no-unused-vars
/*jshint node: true, eqnull: true*/

'use strict';

var React = typeof window === 'undefined' ? require('react') : window.React,
    axe = require('../orb.axe'),
    pgrid = require('../orb.pgrid'),
    domUtils = require('../orb.utils.dom');

module.exports = React.createClass({
  _toInit: [],
  componentDidMount: function() {
    for(var i = 0; i < this._toInit.length; i++){
      var btn = this._toInit[i];
      btn.init(this.props.pivotTableComp, this.refs[btn.ref]);      
    }
  },
  componentDidUpdate: function() {
    for(var i = 0; i < this._toInit.length; i++){
      var btn = this._toInit[i];
      btn.init(this.props.pivotTableComp, this.refs[btn.ref]);      
    }
  },
  createCallback: function(action) {
    if(action != null) {
      var pgridComponent = this.props.pivotTableComp;
      return function(e) {
        action(pgridComponent, e.target || e.srcElement);
      };
    }
    return null;
  },
  render: function() {

    var config = this.props.pivotTableComp.pgridwidget.pgrid.config;

    if(config.toolbar && config.toolbar.visible) {
      
      var configButtons = config.toolbar.buttons ?
        defaultToolbarConfig.buttons.concat(config.toolbar.buttons) :
        defaultToolbarConfig.buttons;
      var currentViewType = this.props.pivotTableComp.pgridwidget.pgrid.getViewType();
      var buttons = [];
      this._toInit = [];
      for(var i = 0; i < configButtons.length; i++) {
        var btnConfig = configButtons[i];
        var refName = 'btn' + i;

        if (!btnConfig.viewType || currentViewType==btnConfig.viewType || (Array.isArray(btnConfig.viewType) && btnConfig.viewType.includes(currentViewType))) {
          if(btnConfig.type == 'separator') {
            buttons.push(<div key={i} className="orb-tlbr-sep"></div>);
          } else if(btnConfig.type == 'label') {
            buttons.push(<div key={i} className="orb-tlbr-lbl">{btnConfig.text}</div>);
          } else {
            buttons.push(<div key={i} className={'orb-tlbr-btn ' + btnConfig.cssClass} title={btnConfig.tooltip} ref={refName} onClick={ this.createCallback(btnConfig.action) }></div>);
          }
          if(btnConfig.init) {
            this._toInit.push({
              ref: refName,
              init: btnConfig.init
            });
          }
        }
      }

      return <div>
        { buttons }
        </div>;
    }

    return <div></div>;
  }
});

var excelExport = require('../orb.export.excel');

var viewTypeStyle = {};
viewTypeStyle[pgrid.ViewType.TABULAR] = 'tabular-view';
viewTypeStyle[pgrid.ViewType.BAR_CHART] = 'bar-chart-view';
viewTypeStyle[pgrid.ViewType.STACKED_BAR_CHART] = 'stacked-bar-chart-view';
viewTypeStyle[pgrid.ViewType.PIE_CHART] = 'pie-chart-view';

var defaultToolbarConfig = {
  exportToExcel: function(pgridComponent, button) { // eslint-disable-line no-unused-vars
    var a = document.createElement('a');
    a.download = 'orbpivotgrid.xls';
    a.href =  excelExport(pgridComponent.props.pgridwidget);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
  expandAllRows: function(pgridComponent, button) { // eslint-disable-line no-unused-vars
      pgridComponent.pgridwidget.toggleFieldExpansion(axe.Type.ROWS, null, true);
  },
  collapseAllRows: function(pgridComponent, button) { // eslint-disable-line no-unused-vars
      pgridComponent.pgridwidget.toggleFieldExpansion(axe.Type.ROWS, null, false);
  },
  expandAllColumns: function(pgridComponent, button) { // eslint-disable-line no-unused-vars
      pgridComponent.pgridwidget.toggleFieldExpansion(axe.Type.COLUMNS, null, true);
  },
  collapseAllColumns: function(pgridComponent, button) { // eslint-disable-line no-unused-vars
      pgridComponent.pgridwidget.toggleFieldExpansion(axe.Type.COLUMNS, null, false);
  },
  updateSubtotalsButton: function(axetype, pgridComponent, button) {
    var subTotalsState = pgridComponent.pgridwidget.areSubtotalsVisible(axetype);
    button.style.display = subTotalsState === null ? 'none' : '';

    var classToAdd = '';
    var classToRemove = '';
    if(subTotalsState) {
      classToAdd = 'subtotals-visible';
      classToRemove = 'subtotals-hidden';
    } else {
      classToAdd = 'subtotals-hidden';
      classToRemove = 'subtotals-visible';
    }
    
    domUtils.removeClass(button, classToRemove);
    domUtils.addClass(button, classToAdd);
  },
  initSubtotals: function(axetype) {
    var self = this;
    return function(pgridComponent, button) {
      self.updateSubtotalsButton(axetype, pgridComponent, button);
    };
  },
  toggleSubtotals: function(axetype) {
    var self = this;
    return function(pgridComponent, button) {
      pgridComponent.toggleSubtotals(axetype);
      self.updateSubtotalsButton(axetype, pgridComponent, button);
    };
  },
  updateGrandtotalButton: function(axetype, pgridComponent, button) {
    var subTotalsState = pgridComponent.pgridwidget.isGrandtotalVisible(axetype);
    button.style.display = subTotalsState === null ? 'none' : '';

    var classToAdd = '';
    var classToRemove = '';
    if(subTotalsState) {
      classToAdd = 'grndtotal-visible';
      classToRemove = 'grndtotal-hidden';
    } else {
      classToAdd = 'grndtotal-hidden';
      classToRemove = 'grndtotal-visible';
    }
    
    domUtils.removeClass(button, classToRemove);
    domUtils.addClass(button, classToAdd);
  },
  initGrandtotal: function(axetype) {
    var self = this;
    return function(pgridComponent, button) {
      self.updateGrandtotalButton(axetype, pgridComponent, button);
    };
  },
  toggleGrandtotal: function(axetype) {
    var self = this;
    return function(pgridComponent, button) {
      pgridComponent.toggleGrandtotal(axetype);
      self.updateGrandtotalButton(axetype, pgridComponent, button);
    };
  },

  // updateStackedBars: function(pgridComponent, button) {
  //   var stackedBarsState = pgridComponent.pgridwidget.areStackedBars();
  //   button.style = '';
  //   var classToAdd = '';
  //   var classToRemove = '';
  //   if (stackedBarsState){
  //     classToAdd = 'stacked-bars';
  //     classToRemove = 'non-stacked-bars';
  //   } else {
  //     classToAdd = 'non-stacked-bars';
  //     classToRemove = 'stacked-bars';
  //   }
  //   domUtils.removeClass(button, classToRemove);
  //   domUtils.addClass(button, classToAdd);
  // },

  // toggleStackedBars: function() {
  //   var self = this;
  //   return function(pgridComponent, button) {
  //     pgridComponent.toggleStackedBars();
  //     self.updateStackedBars(pgridComponent, button);
  //   };
  // },

  // initStackedBars: function() {
  //   var self = this;
  //   return function(pgridComponent, button) {
  //     self.updateStackedBars(pgridComponent, button);
  //   };
  // },

  updateViewButton: function(viewType, pgridComponent, button) {
    var style = viewTypeStyle[viewType];
    var activeStyle = style + '-active';
    if (viewType==pgridComponent.pgridwidget.getViewType()){
      domUtils.removeClass(button, style);
      domUtils.addClass(button, activeStyle);
    } else {
      domUtils.removeClass(button, activeStyle);
      domUtils.addClass(button, style);
    }
  },

  initView: function(viewType) {
    var self = this;
    return function(pgridComponent, button) {
      self.updateViewButton(viewType, pgridComponent, button);
    };
  },

  toggleView: function(viewType) {
    var self = this;
    return function(pgridComponent, button) {
      pgridComponent.pgridwidget.setViewType(viewType);
      self.updateViewButton(viewType, pgridComponent, button);
    }
  },
  
  initY2: function() {
    var self = this;
    return function(pgridComponent, button) {
      self.updateY2Button(pgridComponent, button);
    };
  },

  toggleY2: function() {
    var self = this;
    return function(pgridComponent, button) { 
      pgridComponent.pgridwidget.toggleY2Visible();
      self.updateY2Button(pgridComponent, button);
    };
  },

  updateY2Button: function(pgridComponent, button) {
    if (pgridComponent.pgridwidget.getY2Visible()){
      domUtils.removeClass(button, 'y-axis');
      domUtils.addClass(button, 'y2-axis');
    } else {
      domUtils.removeClass(button, 'y2-axis');
      domUtils.addClass(button, 'y-axis');
    }
  }

};

defaultToolbarConfig.buttons = [
  {type: 'button', tooltip: `Tabular view`, cssClass: 'tabular-view', 
      init: defaultToolbarConfig.initView(pgrid.ViewType.TABULAR), action: defaultToolbarConfig.toggleView(pgrid.ViewType.TABULAR)},
  {type: 'button', tooltip: 'Bar chart view', cssClass: 'bar-chart-view', 
      init: defaultToolbarConfig.initView(pgrid.ViewType.BAR_CHART), action: defaultToolbarConfig.toggleView(pgrid.ViewType.BAR_CHART)},
  {type: 'button', tooltip: 'Stacked bar chart view', cssClass: 'stacked-bar-chart-view', 
      init: defaultToolbarConfig.initView(pgrid.ViewType.STACKED_BAR_CHART), action: defaultToolbarConfig.toggleView(pgrid.ViewType.STACKED_BAR_CHART)},
  {type: 'button', tooltip: 'Pie chart view', cssClass: 'pie-chart-view', 
      init: defaultToolbarConfig.initView(pgrid.ViewType.PIE_CHART), action: defaultToolbarConfig.toggleView(pgrid.ViewType.PIE_CHART)},
  
  { type: 'separator', viewType: pgrid.ViewType.TABULAR},
  { type: 'label', text: 'Rows:', viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Expand all rows', cssClass: 'expand-all', action: defaultToolbarConfig.expandAllRows, viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Collapse all rows', cssClass: 'collapse-all', action: defaultToolbarConfig.collapseAllRows, viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Toggle rows sub totals', init: defaultToolbarConfig.initSubtotals(axe.Type.ROWS), viewType: pgrid.ViewType.TABULAR,
                                                       action: defaultToolbarConfig.toggleSubtotals(axe.Type.ROWS)},
  { type: 'button', tooltip: 'Toggle rows grand total', init: defaultToolbarConfig.initGrandtotal(axe.Type.ROWS), viewType: pgrid.ViewType.TABULAR,
                                                        action: defaultToolbarConfig.toggleGrandtotal(axe.Type.ROWS)},
  { type: 'separator', viewType: pgrid.ViewType.TABULAR},
  { type: 'label', text: 'Columns:', viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Expand all columns', cssClass: 'expand-all', action: defaultToolbarConfig.expandAllColumns, viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Collapse all columns', cssClass: 'collapse-all', action: defaultToolbarConfig.collapseAllColumns, viewType: pgrid.ViewType.TABULAR},
  { type: 'button', tooltip: 'Toggle columns sub totals', init: defaultToolbarConfig.initSubtotals(axe.Type.COLUMNS), viewType: pgrid.ViewType.TABULAR,
                                                          action: defaultToolbarConfig.toggleSubtotals(axe.Type.COLUMNS)},
  { type: 'button', tooltip: 'Toggle columns grand total', init: defaultToolbarConfig.initGrandtotal(axe.Type.COLUMNS), viewType: pgrid.ViewType.TABULAR,
                                                           action: defaultToolbarConfig.toggleGrandtotal(axe.Type.COLUMNS)},
  
  { type: 'separator', viewType: [pgrid.ViewType.BAR_CHART, pgrid.ViewType.STACKED_BAR_CHART]},
  { type: 'button', tooltip: 'Show/hide second y axis', viewType: [pgrid.ViewType.BAR_CHART, pgrid.ViewType.STACKED_BAR_CHART],
        init: defaultToolbarConfig.initY2(), action: defaultToolbarConfig.toggleY2()},

  { type: 'separator'},
  { type: 'label', text: 'Export:'},
  { type: 'button', tooltip: 'Export to Excel', cssClass: 'export-xls', action: defaultToolbarConfig.exportToExcel}
];