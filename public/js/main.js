(function($) {
  'use strict';


  var minZoom = 10;
  var maxZoom = 18;

  // initialize leaflet map
  // leaflet instance comes with cartodb.js
  var map = L.map('hhtreesmap', {
    minZoom: minZoom,
    maxZoom: maxZoom,
    zoomControl: false // we customize the zoomControls
  }).setView([53.55, 10], 12); // zoom to Hamburg with reasonable zoom

  L.tileLayer('http://{s}.tiles.mapbox.com/v3/hnrchrdl.m178h87n/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG5yY2hyZGwiLCJhIjoiTnBfaExPTSJ9.tey74sfeV-vLUx9r6dMeLg', {
    attribution: 'created by <a href="/">hnrchrdl</a> | Map data &copy; <a href="http://openstreetmap.org">OSM</a> contributors | <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a> | Imagery © <a href="http://mapbox.com">Mapbox</a>',
  }).addTo(map);

  // define tree types
  // this could be improved 
  var treetypes = [{ 
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
      name: 'Birke',
      color: '#90CAF9',
      filter: ['Birke']
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
  }];

  // set height of markers
  // the should look like the real size of trees on map
  // pixel to m translation http://wiki.openstreetmap.org/wiki/Zoom_levels
  // 1 / 10 is the minimum size
  var pixelsizes = {
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
  };

  // set cartodb dataset name
  var dataset = 'baeume2_utf8_wgs84';

  // define cartocss
  var style = '';
  //marker defaults
  style +=  '#' + dataset + ' {';
  style += 'marker-opacity: 0.65; ';
  style += 'marker-height: [krone_int]; ';
  style += 'marker-fill: #fff; ';
  style += 'marker-line-width: 0; ';
  style += 'marker-allow-overlap: true; ';

  //marker heights
  var exaggeration = 1.5;
  _.each(_.range(minZoom, maxZoom + 1), function(zoomlevel) {
    style +=  '[zoom = ' + zoomlevel + '] { marker-height: [krone_int] * ' + pixelsizes[zoomlevel] * exaggeration + '; }';      
  });

  style += '} ';

  //marker colors
  $.each(treetypes, function(treeindex, tree) {
    $.each(tree.filter, function(filterindex, filter) {
      style +=  '#' + dataset + ' [ baumart =~ ".*' + filter + '.*" ] { marker-fill: ' + tree.color + ';} ';
      style +=  '#' + dataset + ' [ baumart =~ ".*' + filter.toLowerCase() + '.*" ] { marker-fill: ' + tree.color + ';} ';      
    });
  });
      

  // create a layer with 1 sublayer
  cartodb.createLayer(map, {
    user_name: 'hnrchrdl',
    type: 'cartodb',
    sublayers: [{
      sql: 'SELECT * FROM ' + dataset,
      cartocss: style,
      interactivity: 'baumart'
    }]
  })
  .addTo(map) // add the layer to our map which already contains 1 sublayer
  .done(function(layer) {

    layer.on("loading", function() {
      $('#loading').fadeIn();
    });
    layer.on("load", function() {
      $('#loading').fadeOut();
    });

    //create and add a new sublayer
    layer.getSubLayer(0).setInteraction(true);

    // feature interaction on mouseover
    layer.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
      var x = e.clientX,
          y = e.clientY,
          el = document.elementFromPoint(x, y);
      $('.info').text(data.baumart);
      $('.info').show();
    });
    layer.on('featureOut', function(e, latlng, pos, data, subLayerIndex) {
      $('.info').hide();
    });

    // prevent data from being shown on entering the control elements defined below
    $(document).on('mouseenter', '.legend-item, .controlelement, .about' , function() {
      $('.info').hide();
    });

  }).error(function(err) {
    console.log(err);
  });

  // fill legend
  $.each(treetypes, function(index, tree) {
    $('#legend').append('<div id="legend-item-' + index + '" class="legend-item"><svg id="circle-' + index + 
        '" height="10" width="20" xmlns="http://www.w3.org/2000/svg">' +
        '<circle id="greencircle" cx="5" cy="5" r="5" fill="' +  tree.color + '" opacity="0.65" />' +
        '</svg>' + tree.name + '</div>');
  });
  $('#legend').append('<div id="legend-item-999" class="legend-item"><svg id="circle-999' + 
        '" height="10" width="20" xmlns="http://www.w3.org/2000/svg">' +
        '<circle id="greencircle" cx="5" cy="5" r="5" fill="#fff" opacity="0.65" />' +
        '</svg>Sonstige</div>');




  $(document).ready(function() {

    $('#legend').niceScroll({
      cursorcolor: '#ccc',
      cursoropacitymin: 0.2,
      cursoropacitymax: 0.8,
      cursorwidth: 2,
      cursorborder: 'none',
      cursorborderradius: '0px'
    });

    $('#zoomin').on('click', function() {
      map.zoomIn();
    });
    $('#zoomout').on('click', function() {
      map.zoomOut();
    });


    // make info div follow mouse
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

    //show / hide div
    $('.abouttrigger').on('click', function() {
      $('.about').fadeIn('slow');
    });
    $('.about').on('click', function() {
      $('.about').fadeOut('slow');
    });

  });


})(jQuery);