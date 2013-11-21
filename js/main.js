function log(){
  for (var i=0;i<arguments.length;i++)
    console.log( arguments[i] );
  }

$(window).load(function(){

  // Prevent browserbounce / dragging "outside" of the html
  $(document).on(
    'touchmove',
    function(e) {
      e.preventDefault();
    }
  );

  // Prevent paginator from moving up while onscreen keyboard is visible
  var $body = $('#paginator');
  $(document)
  .on('focus', 'input', function(e) {
    $body.addClass('fixfixed');
  })
  .on('blur', 'input', function(e) {
    $body.removeClass('fixfixed');
  });

  $('.toucharea').hammer({
  //  prevent_default: true
  });

  $(window).bind("resize", function(evt){
    var scrollWidth =  $('.page').width() + $('.spacer').width();
    var scrollPosition = (pageNumber - 1) * scrollWidth;
    $("body").scrollLeft(scrollPosition);
    DrawConnectionsBetweenImages();
  });

  DrawConnectionsBetweenImages();

  function DrawConnectionsBetweenImages(){
    var ctx = initCanvas();
    var curveRadius = 20;
    var drawSuccess = true;
    var pixelOffset = 0; // To prevent fuzzy lines if needed: change to 0.5

    var connectionCount = $('div.spacer').length;
    for (var i=0; i<connectionCount; i++) //i = indexConnection
    {
      drawConnection( $('img.connected').eq(i), $('div.spacer').eq(i),$('img.connected').eq(i+1) );
    }
    if (drawSuccess) ctx.stroke();

    function initCanvas(){
      var largestYOfImages = Math.max.apply(null,
        $('.page').map(function(index,elm){
          return Math.floor( $(elm).offset().top + $(elm).width() );
        }).toArray());
      var canvasDimensionsMargin = -3; //To be sure the connection line is drawn inside canvas borders;
      var height = largestYOfImages + canvasDimensionsMargin;
      var width = $('img.connected:last').offset().left + canvasDimensionsMargin;

      var ctx = $('canvas').get(0).getContext('2d');

      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0a404c';
      ctx.clearRect ( 0, 0, width, height );
      return ctx;
    }

    function drawConnection(elm1,elm2,elm3){

      var pos = getPosRightBorder(elm1);
      moveTo(pos);

      drawStraight( getPosLeftBorder(elm2).x - getPosRightBorder(elm1).x, true );
      drawSpacerLineTo( {x: getPosRightBorder(elm2).x, y: getPosLeftBorder(elm3).y } );
      drawStraight( getPosLeftBorder(elm3).x - getPosRightBorder(elm2).x, true );

      function drawStraight(distance, IsHorizontal){
        pos = {
          x: pos.x + (IsHorizontal ? distance : 0),
          y: pos.y + (IsHorizontal ? 0 : distance)
        }
        ctx.lineTo(pos.x, pos.y);
      }
      function drawSpacerLineTo(posEnd){
        var widthSpacer = posEnd.x - pos.x;
        var lengthStraightHorizontal = (widthSpacer - curveRadius * 2) / 2;
        if (lengthStraightHorizontal < 0) drawSuccess = false;
        drawStraight(lengthStraightHorizontal, true);

        var heightSpacer = pos.y - posEnd.y;
        var lengthStraightVertical =  Math.abs(heightSpacer) - curveRadius * 2;
        if (lengthStraightVertical < 0) drawSuccess = false;

        goUpwards = heightSpacer > 0;
        drawCurve( goUpwards, true);
        drawStraight( lengthStraightVertical * (goUpwards ? -1 : 1), false);
        drawCurve( goUpwards, false);
        drawStraight(lengthStraightHorizontal, true);
      }
      function drawCurve(bendUpwards, isHorizontalAtStart){
        var bendFactor = bendUpwards ? -1 : 1;
        var endX = pos.x + curveRadius;
        var endY = pos.y + bendFactor * curveRadius;

        var cx = 0 //Control-point x;
        var cy = 0 //Control-point y;
        if (isHorizontalAtStart){
          cx = endX;
          cy = pos.y;
        }else{
          cx = pos.x;
          cy = endY;
        }

        ctx.quadraticCurveTo( cx, cy, endX, endY );
        pos = {x: endX, y: endY};
      }

      function getPosLeftBorder(elm){
        return { x: Math.floor(elm.offset().left)+pixelOffset, y: Math.floor(elm.offset().top + elm.height()/2)+pixelOffset }
      }
      function getPosRightBorder(elm){
        return { x: Math.floor(elm.offset().left + elm.width())+pixelOffset, y: Math.floor(elm.offset().top + elm.height()/2)+pixelOffset }
      }
      function moveTo(pos){
        ctx.moveTo(pos.x, pos.y);
      }
    }
  }
});
