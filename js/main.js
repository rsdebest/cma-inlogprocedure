function log(x){console.log(x)}

$(window).load(function(){

  var hammertime = $('.toucharea').hammer({
  //  prevent_default: true
  });

  var scrollPosition  = 0;
  var pageCount       = 5;
  var pageNumber      = 1;
  var moveLeft        = -1;
  var moveRight       = 1;
  var isAnimating     = false;
  var pageWidth, spacerWidth, scrollWidth;


  paginating = function(pageNumber){
    $('#paginator .active').removeClass('active');
    $('#paginator #page_'+ pageNumber).addClass('active');
  }
  paginating(pageNumber);


  initDimensions = function(){
    pageWidth   = $('.page').width();
    spacerWidth = $('.spacer').width();
    scrollWidth = pageWidth + spacerWidth;
  }
  initDimensions();

  getOnSwipeCallback = function(direction){
    return function(ev) {

      if (isAnimating == true){
        return false;
      }
      isAnimating = true;

      if ((direction === moveLeft && pageNumber == 1) || (direction === moveRight && pageNumber == pageCount)){
        //do nothing;
      } else {
        pageNumber += direction;
      }
      log("PageNumber: " + pageNumber);
      scrollPosition = $(document).scrollLeft();
      $("body").stop().animate({
      "scrollLeft": (scrollPosition + direction * scrollWidth)
      }, 1000,
      function(){
        isAnimating = false;
        paginating(pageNumber);
      });
    }
  }



  /*
  hammertime.on("release", function(e,v){

    var navDirection  = e.gesture.direction == "left" ? moveRight:moveLeft;
    var distance      = e.gesture.distance;
    if (distance > 200){
      //Navigeer naar volgende pagina
      var newScrollPosition = (pageNumber + navDirection) * scrollWidth;

      $("body").animate({
        "scrollLeft": newScrollPosition
      });
      pageNumber += navDirection;
    } else {
      //Snap terug naar oude pagina
      var newScrollPosition = pageNumber * scrollWidth;
      $("body").animate({
        "scrollLeft": newScrollPosition
      });
    }
    log('released')
  })*/

  $(window).bind("resize", function(evt){
    log("window resize");
    initDimensions();
    var scrollPosition = (pageNumber - 1) * scrollWidth;
    $("body").scrollLeft(scrollPosition);
  });
});

$(window).load(function() {

  (function DrawConnectionsBetweenImages(){
    var largestYOfImages = Math.max.apply(null,
      $('#img1,#img2,#img3,#img4').map(function(index,elm){
        return Math.floor( $(elm).offset().top + $(elm).width() );
      }).toArray());
    var canvasDimensionsMargin = 30; //To be sure the connection line is drawn inside canvas borders;
    var height = largestYOfImages + canvasDimensionsMargin;
    var width = $('img.connected:last').offset().left + canvasDimensionsMargin;


    var ctx = $('canvas').get(0).getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.lineWidth = 4;
    var curveRadius = 20;
    var drawSuccess = true;

    var connectionCount = $('img.connected').length - 1;
    for (var i=0; i<connectionCount; i++) //i = indexConnection
    {
      drawConnection( $('img.connected').eq(i), $('div.spacer').eq(i),$('img.connected').eq(i+1) );
    }
    if (drawSuccess) ctx.stroke();

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
        return { x: elm.offset().left, y: elm.offset().top + elm.height()/2 }
      }
      function getPosRightBorder(elm){
        return { x: elm.offset().left + elm.width(), y: elm.offset().top + elm.height()/2 }
      }
      function moveTo(pos){
        ctx.moveTo(pos.x, pos.y);
      }
    }
  })()
});
