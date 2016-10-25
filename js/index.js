/* 
  David Desandro's horizontal collapsable menu
  http://codepen.io/desandro/
  http://desandro.com/
*/

// variables

var dragbarSize = 20;
var windowWidth;

// --------------------------  -------------------------- //

document.addEventListener( 'DOMContentLoaded', init );

var dragger1, dragger2, dragger3;
var panel1Elem, panel2Elem, panel3Elem, panelElems;
var panel2X = 1/3;
var panel3X = 2/3;

var panel2MoveX, panel3MoveX, panel2StartX, panel3StartX;

function init() {
  panel1Elem = document.querySelector('.code-panel-1');
  panel2Elem = document.querySelector('.code-panel-2');
  panel3Elem = document.querySelector('.code-panel-3');
  panelElems = [ panel1Elem, panel2Elem, panel3Elem ];

  dragger1 = new BarDragger([ document.querySelector('.code-panel-1 .code-panel-dragbar') ]);
  dragger2 = new BarDragger([ document.querySelector('.code-panel-2 .code-panel-dragbar') ]);
  dragger3 = new BarDragger([ document.querySelector('.code-panel-3 .code-panel-dragbar') ]);

  // -----  ----- //
  
  dragger1.on( 'doubleClick', function() {
    expandPanel( panel1Elem );
    var barSize = dragbarSize / window.innerWidth;
    panel2X = 1 - barSize*2;
    panel3X = 1 - barSize;
  });

  // -----  ----- //

  dragger2.on( 'dragStart', function() {
    panel2StartX = panel2X;
    panel3MoveX = panel3X;
    windowWidth = window.innerWidth;
  });

  dragger2.on( 'dragMove', function( event, pointer, moveVector ) {
    var barSize = dragbarSize/windowWidth;
    // change position of panel2, by changing width of panel1
    panel2MoveX = panel2StartX + ( moveVector.x / windowWidth );
    panel2MoveX = Math.max( barSize, panel2MoveX );
    panel2MoveX = Math.min( 1 - barSize*2, panel2MoveX );
    panel3MoveX = Math.max( panel2MoveX + barSize, panel3MoveX );
    dragResizePanels( panel2MoveX, panel3MoveX );
  });

  dragger2.on( 'dragEnd', onDragEnd );

  function onDragEnd() {
    panel2X = panel2MoveX;
    panel3X = panel3MoveX;
  }

  dragger2.on( 'doubleClick', function() {
    expandPanel( panel2Elem );
    var barSize = dragbarSize / window.innerWidth;
    panel2X = barSize;
    panel3X = 1 - barSize;
  });

  // ----- dragger 3 ----- //

  dragger3.on( 'dragStart', function() {
    panel3StartX = panel3X;
    panel2MoveX = panel2X;
    windowWidth = window.innerWidth;
  });

  dragger3.on( 'dragMove', function( event, pointer, moveVector ) {
    var barSize = dragbarSize/windowWidth;
    // change position of panel3, by changing width of panel2
    panel3MoveX = panel3StartX + moveVector.x/windowWidth;
    panel3MoveX = Math.max( barSize*2, panel3MoveX );
    panel3MoveX = Math.min( 1 - barSize, panel3MoveX );
    panel2MoveX = Math.min( panel2MoveX, panel3MoveX - barSize );
    dragResizePanels( panel2MoveX, panel3MoveX );
  });

  dragger3.on( 'dragEnd', onDragEnd );

  dragger3.on( 'doubleClick', function() {
    expandPanel( panel3Elem );
    var barSize = dragbarSize / window.innerWidth;
    panel2X = barSize;
    panel3X = barSize * 2;
  });

}

function dragResizePanels( panel2ResizeX, panel3ResizeX ) {
  var barSize = dragbarSize/windowWidth;
  panel1Elem.style.width = panel2ResizeX*100 + '%';
  var panel2Width = Math.max( barSize, panel3ResizeX - panel2ResizeX );
  panel2Elem.style.width = panel2Width*100 + '%';
  panel3Elem.style.width = ((1 - panel3ResizeX ) * 100 ) + '%';
  // add skinny classes to rotate title
  panel1Elem.classList[ panel2ResizeX < 0.07 ? 'add' : 'remove' ]('is-horiz-skinny');
  panel2Elem.classList[ panel2Width < 0.07 ? 'add' : 'remove' ]('is-horiz-skinny');
  panel3Elem.classList[ (1 - panel3ResizeX ) < 0.07 ? 'add' : 'remove' ]('is-horiz-skinny');
}

// -------------------------- BarDragger -------------------------- //

function BarDragger( handles ) {
  this.handles = handles;
  this.bindHandles();
}

BarDragger.prototype = Object.create( Unidragger.prototype );

BarDragger.prototype.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
  // track double click
  if ( this.didFirstClick ) {
    this.emitEvent( 'doubleClick', [ event, pointer ] );
    delete this.didFirstClick;
    clearTimeout( this.doubleClickTimeout );
  } else {
    this.didFirstClick = true;
    this.doubleClickTimeout = setTimeout( function() {
      delete this.didFirstClick;
    }.bind( this ), doubleClickTime );
  }
};

var doubleClickTime = 350;

// --------------------------  -------------------------- //

function expandPanel( expandPanelElem ) {
  var barSize = dragbarSize / window.innerWidth;

  for ( var i=0, len = panelElems.length; i < len; i++ ) {
    var panelElem = panelElems[i];
    var isExpanding = panelElem == expandPanelElem;
    var transitionWidth = isExpanding ? 1 - barSize*2 : barSize;
    transition( panelElem, { width: transitionWidth*100 + '%' } );
    panelElem.classList[ isExpanding ? 'remove' : 'add' ]('is-horiz-skinny');
  }
}

// --------------------------  -------------------------- //

var proxyElem = document.createElement('div');

function transition( elem, style ) {
  /* jshint unused: false */ // for reflow trigger
  var isSame = false;
  // check if transition style is already set
  for ( var prop in style ) {
    proxyElem.style[ prop ] = style[ prop ];
    isSame = elem.style[ prop ] == proxyElem.style[ prop ];
    if ( !isSame ) {
      break;
    }
  }
  // bail if transition not needed
  if ( isSame ) {
    return;
  }

  // enable transition
  var props = [];
  for ( prop in style ) {
    props.push( prop );
  }
  elem.style.transitionProperty = props.join('');
  elem.style.transitionDuration = '0.4s';
  elem.addEventListener( 'transitionend', onTransitionend, false );
  // trigger reflow
  var h = elem.offsetHeight;
  // set transition style
  for ( prop in style ) {
    elem.style[ prop ] = style[ prop ];
  }
}

function onTransitionend( event ) {
  // disable transition styles
  event.target.style.transitionProperty = null;
  event.target.style.transitionDuration = null;
}