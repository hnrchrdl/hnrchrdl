
//= require lib/cartodb

/**
 * JS for the HHTrees App
 */

function hhtreesApp() {
  'use strict';

  var app = {};


  // App Wide Options
  app.options = {
    minZoom: 10,
    maxZoom: 18,
    cartodb: {
      username: 'hnrchrdl',
      dataset: 'baeume2_utf8_wgs84'
    }
  };


  // Define tree type model.
  // This could be improved.

  app.model = {

    treetypes: [],

    treeTypes: [
      {
        name: 'Ahorn',
        color: '#26A69A',
        filter: ['Ahorn']
      },
      {
        name: 'Akazie',
        color: '#00695C',
        filter: ['Akazie']
      },
      {
        name: 'Amberbaum',
        color: '#1DE9B6',
        filter: ['Amberbaum']
      },
      {
        name: 'Apfel',
        color: '#FF7043',
        filter: ['Apfel']
      },
      {
        name: 'Birne',
        color: '#BF360C',
        filter: ['Birne']
      },
      {
        name: 'Birke', color: '#90CAF9', filter: ['Birke']
      },
      {
        name: 'Buche',
        color: '#827717',
        filter: ['Buche']
      },
      {
        name: 'Eberesche',
        color: '#66BB6A',
        filter: ['Eberesche']
      },
      {
        name: 'Eibe',
        color: '#2E7D32',
        filter: ['Eibe']
      },
      {
        name: 'Eiche',
        color: '#00E676',
        filter: ['Eiche']
      },
      {
        name: 'Erle',
        color: '#9CCC65',
        filter: ['Erle']
      },
      {
        name: 'Esche',
        color: '#558B2F',
        filter: ['Esche']
      },
      {
        name: 'Fichte',
        color: '#00BFA5',
        filter: ['Fichte']
      },
      {
        name: 'Ginkgo',
        color: '#E91E63',
        filter: ['Ginkgo']
      },
      {
        name: 'Gleditschie',
        color: '#FFCA28',
        filter: ['Gleditschie']
      },
      {
        name: 'Goldregen',
        color: '#FFEB3B',
        filter: ['Goldregen']
      },
      {
        name: 'Hasel',
        color: '#3E2723',
        filter: ['Hasel']
      },
      {
        name: 'Holunder',
        color: '#EF5350',
        filter: ['Holunder']
      },
      {
        name: 'Kastanie',
        color: '#9E9D24',
        filter: ['Kastanie']
      },
      {
        name: 'Kiefer',
        color: '#0277BD',
        filter: ['Kiefer']
      },
      {
        name: 'Kirsche',
        color: '#F44336',
        filter: ['Kirsche']
      },
      {
        name: 'Lärche',
        color: '#00B8D4',
        filter: ['Lärche']
      },
      {
        name: 'Linde',
        color: '#C6FF00',
        filter: ['Linde']
      },
      {
        name: 'Magnolie',
        color: '#FFA000',
        filter: ['Magnolie']
      },
      {
        name: 'Mammutbaum',
        color: '#FF6D00',
        filter: ['Mammutbaum']
      },
      {
        name: 'Mehlbeere',
        color: '#EA80FC',
        filter: ['Mehlbeere']
      },
      {
        name: 'Mispel',
        color: '#69F0AE',
        filter: ['Mispel']
      },
      {
        name: 'Pappel',
        color: '#64DD17',
        filter: ['Pappel']
      },
      {
        name: 'Pflaume',
        color: '#6A1B9A',
        filter: ['Pflaume']
      },
      {
        name: 'Platane',
        color: '#33691E',
        filter: ['Platane']
      },
      {
        name: 'Robinie',
        color: '#FFC107',
        filter: ['Robinie']
      },
      {
        name: 'Schlehe',
        color: '#CDDC39',
        filter: ['Schlehe']
      },
      {
        name: 'Tanne',
        color: '#29B6F6',
        filter: ['Tanne']
      },
      {
        name: 'Ulme',
        color: '#8BC34A',
        filter: ['Ulme']
      },
      {
        name: 'Vogelbeere',
        color: '#E91E63',
        filter: ['Vogelbeere']
      },
      {
        name: 'Wacholder',
        color: '#FF5722',
        filter: ['Wacholder']
      },
      {
        name: 'Walnuss',
        color: '#795548',
        filter: ['Walnuss']
      },
      {
        name: 'Weide',
        color: '#64DD17',
        filter: ['Weide']
      },
      {
        name: 'Weißdorn',
        color: '#F4FF81',
        filter: ['Weißdorn']
      },
      {
        name: 'Zeder',
        color: '#18FFFF',
        filter: ['Zeder']
      },
      {
        name: 'Zypresse',
        color: '#AEEA00',
        filter: ['Zypresse']
      }
    ],

    // Set height of markers.
    // They should look like the real size of trees on map.
    // Pixel to m translation http://wiki.openstreetmap.org/wiki/Zoom_levels.
    // 1 / 10 is the minimum size
    pixelMeterSizes: {
      10: 1 / 10,
      11: 1 / 9,
      12: 1 / 8,
      13: 1 / 7,
      14: 1/ 5,
      15: 1 / 4.773,
      16: 1 / 2.387,
      17: 1 / 1.193,
      18: 1 / 0.596
      //19: 1 / 0.298

    },
    nameFilter: [],
    idFilter: []
  };


  app.controller = {

    launchApp: function() {
      app.controller.processData(function cb() {
        app.controller.generateTrees();
        app.controller.generateCartoCss();
        app.controller.initMap();
        app.controller.createLayer();
        app.view.init();
      });


    },

    processData: function getData(cb) {
      var sql = new cartodb.SQL({ user: app.options.cartodb.username });

      sql.execute('SELECT * FROM  ' + app.options.cartodb.dataset)
      .done(function(data) {

        var parseDate = d3.time.format('%Y').parse;
        data.rows.forEach(function(row) {
          row.pflanzjahr = parseDate(row.pflanzjahr.toString()).getFullYear();
        });
        app.model.rawdata = data.rows;
        console.log(app.model.rawdata);

        app.controller.treecf = crossfilter(app.model.rawdata);

        // dimensions
        app.controller.dim = {};
        app.controller.dim.baumart = app.controller.treecf.dimension(function(row) {
          return row.baumart;
        });
        app.controller.dim.pflanzjahr = app.controller.treecf.dimension(function(row) {
          return row.pflanzjahr;
        });
        app.controller.dim.krone = app.controller.treecf.dimension(function(row) {
          return row.krone_int;
        })

        //groups
        app.controller.groups = {};
        app.controller.groups.baumart = app.controller.dim.baumart.group();
        app.controller.groups.pflanzjahr = app.controller.dim.pflanzjahr.group();
        app.controller.groups.krone = app.controller.dim.krone.group();

        // charts
        app.view.charts = {};
        app.view.charts.baumart = dc.rowChart('#legend')
        .dimension(app.controller.dim.baumart)
        .group(app.controller.groups.baumart)
        .width(320)
        .height(800)
        .margins({top: 20, right: 20, bottom: 20, left: 20})
        .ordering(function(d) { return -d.value })
        .colors (d3.scale.category20().range())
        .gap(0)
        .cap(20)
        .on("postRender", function(chart) {
            chart.select("svg")
                .attr("viewBox", "0 0 320 800")
                .attr("preserveAspectRatio", "xMinYMin")
                .attr("width", "100%")
                .attr("height", "100%");
            chart.redraw();
        })
        .on('filtered', function(chart) {
          app.model.nameFilter = chart.filters();
          app.controller.applyFilter();
        })
        .on('postRedraw', function(chart) {
          app.view.correctColors();
        });

        app.view.charts.pflanzjahr = dc.barChart('#pflanzjahr')
        .dimension(app.controller.dim.pflanzjahr)
        .group(app.controller.groups.pflanzjahr)
        .width(420)
        .height(300)
        .margins({top: 20, right: 0, bottom: 20, left: 50})
        .x(d3.scale.linear().domain([1800, 2015]))
        .elasticY(true)
        .gap(0)
        .on('filtered', function(chart) {
          app.model.pflanzjahrFilter = chart.filters()[0];
          app.controller.applyFilter();
        });;

        app.view.charts.krone = dc.barChart('#krone')
        .dimension(app.controller.dim.krone)
        .group(app.controller.groups.krone)
        .width(420)
        .height(300)
        .margins({top: 20, right: 0, bottom: 20, left: 50})
        .x(d3.scale.linear().domain([0, 25]))
        .elasticY(true)
        .gap(0)
        .on('filtered', function(chart) {
          app.model.kronenFilter = chart.filters()[0];
          console.log(app.model.kronenFilter);
          app.controller.applyFilter();
        });

        dc.renderAll();


        var treecounts = _.countBy(data.rows, function(row) {
          return row.baumart;
        });

        var types = _.chain(data.rows).pluck('baumart').uniq().value();

        app.model.treetypes = _.chain(types)
        .map(function(tree) { return { name: tree, count: treecounts[tree] } })
        .remove(function(tree) { return tree.name !== null })
        .sortBy('count').reverse()
        .value();

        cb(); // callback when done
      })
      .error(function(errors) {
        // errors contains a list of errors
        console.log("errors:" + errors);
      });
    },

    generateTrees: function generateTreeTypes() {
      // https://github.com/mbostock/d3/wiki/Ordinal-Scaless
      var colors = d3.scale.category20().range();
      var toptreetypes = _.take(app.model.treetypes, 20);
      app.model.trees = _.map(toptreetypes, function(tree, i) {
        return {
          name: tree.name, count: tree.count, color: colors[i], filter: [tree.name]
        }
      });
    },


    getPixelMeter: function(zoomlevel) {
      // return the meter equivalent for a pixel per given zoomlevel
      return app.model.pixelMeterSizes[zoomlevel];

    },


    // Define Cartocss.
    generateCartoCss: function() {
      var self = this;

      var cartoCss = '';

      // Marker defaults
      cartoCss +=  '#' + app.options.cartodb.dataset + ' {';
      cartoCss += 'marker-opacity: 0.65; ';
      cartoCss += 'marker-height: [krone_int]; ';
      cartoCss += 'marker-fill: #eee; ';
      cartoCss += 'marker-line-width: 0; ';
      cartoCss += 'marker-allow-overlap: true; ';

      // Marker heights.
      var exaggeration = 1.5;
      _.each(_.range(app.options.minZoom, app.options.maxZoom + 1), function(zoomlevel) {

        cartoCss +=  '[zoom = ' + zoomlevel + '] { marker-height: [krone_int] * ' + self.getPixelMeter(zoomlevel) * exaggeration + '; }';
      });
      cartoCss += '} ';

      // Marker colors.
      // Filter is applied to datasets that contain
      // a given marker, caseinsensitive.
      //$.each(app.model.treeTypes, function(index, tree) {
      $.each(app.model.trees, function(index, tree) {
        $.each(tree.filter, function(_index, filter) {

          //cartoCss +=  '#' + app.options.cartodb.dataset + ' [ baumart =~ ".*' + filter + '.*" ] { marker-fill: ' + tree.color + ';} ';
          //cartoCss +=  '#' + app.options.cartodb.dataset + ' [ baumart =~ ".*' + filter.toLowerCase() + '.*" ] { marker-fill: ' + tree.color + ';} ';
          cartoCss +=  '#' + app.options.cartodb.dataset + ' [ baumart ="' + filter + '" ] { marker-fill: ' + tree.color + ';} ';
        });
      });
      return cartoCss;
    },


    initMap: function() {
      // Initialize leaflet map.
      // Leaflet instance comes with cartodb.js.
      this.map = L.map('hhtreesmap', {
        minZoom: app.options.minZoom,
        maxZoom: app.options.maxZoom,
        zoomControl: false
      }).setView([53.55, 10], 12); // Zoom to Hamburg with reasonable zoom

      L.tileLayer('http://{s}.tiles.mapbox.com/v3/hnrchrdl.m178h87n/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG5yY2hyZGwiLCJhIjoiTnBfaExPTSJ9.tey74sfeV-vLUx9r6dMeLg', {
        attribution: 'created by <a href="/">hnrchrdl</a> | Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors | <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | Imagery © <a href="http://mapbox.com">Mapbox</a>',
      }).addTo(this.map);
    },


    createLayer: function(filter) {
      // Create a layer with one sublayer.
      cartodb.createLayer(this.map, {
        user_name: app.options.cartodb.username,
        type: 'cartodb',
        sublayers: [{
          sql: 'SELECT * FROM ' + app.options.cartodb.dataset,
          cartocss: app.controller.generateCartoCss(),
          interactivity: 'baumart'
        }]
      })
      .addTo(this.map) // Add the layer to our map which already contains one sublayer.
      .done(function(layer) {
        app.controller.layer = layer;
        //Create and add a new sublayer
        layer.getSubLayer(0).setInteraction(true);

        layer.on("loading", function() {
          app.view.showLoading();
        });
        layer.on("load", function() {
          app.view.hideLoading();
        });

        layer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
          app.view.changeInfohoverText(data.baumart);
          app.view.showInfohover();
        });

        layer.on('featureOut', function(e, latlng, pos, data, subLayerIndex) {
          app.view.hideInfohover();
        });

        // Prevent data from being shown on entering the control elements defined below.
        $(document).on('mouseenter', '.legend-item, .controlelement, .about' , function() {
          app.view.hideInfohover();
        });

      }).error(function(err) {
        console.log(err);
      });
    },

    clearMap: function() {
      this.map.removeLayer(this.layer);
    },

    applyFilter: function(filter) {
      var sql = '';
      if(app.model.nameFilter.length === 0) {
        sql = 'SELECT * FROM ' + app.options.cartodb.dataset;
      } else {
        // All the items of the array except from the last of the nameFilter Array
        _.each(_.initial(app.model.nameFilter), function(term) {
          sql += 'SELECT * FROM ' + app.options.cartodb.dataset +
              ' WHERE baumart ILIKE \'%' + term + '%\' UNION ';
        });
        // The last element of the nameFilter Array
        sql += 'SELECT * FROM ' + app.options.cartodb.dataset +
            ' WHERE baumart ILIKE \'%' + _.last(app.model.nameFilter) + '%\'';
      }
      if(app.model.kronenFilter) {
        sql += ' INTERSECT SELECT * FROM ' + app.options.cartodb.dataset +
            ' WHERE krone_int BETWEEN ' + app.model.kronenFilter[0].toString() +
            ' AND ' + app.model.kronenFilter[1].toString();
      }
      if(app.model.pflanzjahrFilter) {
        sql += ' INTERSECT SELECT * FROM ' + app.options.cartodb.dataset +
            ' WHERE pflanzjahr BETWEEN ' + app.model.pflanzjahrFilter[0].toString() +
            ' AND ' + app.model.pflanzjahrFilter[1].toString();
      }

      console.log(sql);

      this.layer.getSubLayer(0).setSQL(sql);
    }

  };


  app.view = {

    init: function() {
      //  this.fillLegendContent();
      //this.generateLegendIndicators();
      //this.initFilter();
      this.makeZoomButtonsWork();
      this.makeInfoHoverFollowCursor();
      this.registerAboutTrigger();
      this.registerNiceScroll();
    },

    // little hack to keep tree's color consistant
    correctColors: function gli() {
      console.log(app.model.trees);
      console.log($('#legend .row text'));
      _.each(app.model.trees, function(tree) {
        $('#legend .row text').each(function(idx, textEl) {
          if(tree.name === $(this).html()) {
            //$(this).after('<svg width="50px" height="50px"><circle id="greencircle" cx="100" cy="15" r="50" fill="' +
            //    tree.color + '" opacity="0.65" /></svg>');
            $(this).siblings('rect').attr('fill', tree.color);
          }
        });
      });
    },

    // fillLegendContent: function() {
    //   // Fill legend
    //   $.each(app.model.trees, function(index, tree) {
    //     $('#legend').append('<div id="legend-item-' + index + '" class="legend-item" data-filter="' + tree.name +
    //         '"><svg id="circle-' + index +
    //         '" height="10" width="20" xmlns="http://www.w3.org/2000/svg">' +
    //         '<circle id="greencircle" cx="5" cy="5" r="5" fill="' +  tree.color + '" opacity="0.65" />' +
    //         '</svg>' + tree.name + '</div>');
    //   });
    //   $('#legend').append('<div id="legend-item-999" class="legend-item"><svg id="circle-999' +
    //         '" height="10" width="20" xmlns="http://www.w3.org/2000/svg">' +
    //         '<circle id="greencircle" cx="5" cy="5" r="5" fill="#fff" opacity="0.65" />' +
    //         '</svg>Sonstige</div>');
    // },

    initFilter: function () {
      $(document).on('click', '.legend-item',  function() {
        app.controller.toggleNameFilter($(this).data('filter'));
        app.view.nameFilterVis();
      });
    },

    nameFilterVis: function() {
      var nameFilter = app.model.nameFilter;
      if(nameFilter.length === 0) {
        // remove all inactives
        $('.legend-item').each(function(index) {
          $(this).removeClass('inactive');
        });
      } else {
        $('.legend-item').each(function(index) {
          if(_.indexOf(nameFilter, $(this).data('filter')) === -1) {
            if(!$(this).hasClass('inactive')) {
              $(this).addClass('inactive');
            }
          } else {
            $(this).removeClass('inactive');
          }
        });
      }
    },

    makeZoomButtonsWork: function() {
      // Register the Zoombuttons functionality
      $('#zoomin').on('click', function() {
        app.controller.map.zoomIn();
      });
      $('#zoomout').on('click', function() {
        app.controller.map.zoomOut();
      });
    },

    makeInfoHoverFollowCursor: function() {
      // Make info div follow mouse
      var $mouseX = 0, $mouseY = 0;
      var $xp = 0, $yp =0;
      $(document).mousemove(function(e){
          $mouseX = e.pageX;
          $mouseY = e.pageY;
      });
      var $loop = setInterval(function(){
        // change 12 to alter damping higher is slower
        $xp += (($mouseX - $xp)/3);
        $yp += (($mouseY - $yp)/3);
        $("#info").css({left:$xp +'px', top:$yp +'px'});
      }, 80);
    },

    registerAboutTrigger: function() {
      // Show / hide info div.
      $('.abouttrigger').on('click', function() {
        $('.about').fadeIn('slow');
      });
      $('.about').on('click', function() {
        $('.about').fadeOut('slow');
      });
    },

    registerNiceScroll: function() {
      $('#legend').niceScroll({
        cursorcolor: '#ccc',
        cursoropacitymin: 0.2,
        cursoropacitymax: 0.8,
        cursorwidth: 2,
        cursorborder: 'none',
        cursorborderradius: '0px'
      });
    },

    showLoading: function() {
      $('#loading').fadeIn();
    },

    hideLoading: function() {
      $('#loading').fadeOut();
    },

    showInfohover: function() {
      $('.info').show();
    },

    hideInfohover: function() {
      $('.info').hide();
    },

    changeInfohoverText: function(text) {
      $('.info').text(text);
    },
  };

  return app;
}



$(function() {

  // Create app instance and kick it off.
  var app = new hhtreesApp();
  app.controller.launchApp();

});
