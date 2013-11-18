function log(x){console.log(x)}

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

  hammertime.on("swipeleft", getOnSwipeCallback(moveRight));
  hammertime.on("swiperight", getOnSwipeCallback(moveLeft));

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
    var width = $('#img5').offset().left + canvasDimensionsMargin;


    var ctx = $('canvas').get(0).getContext('2d');
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    ctx.strokeStyle = '#0a404c';
    ctx.lineWidth = 4;

    drawConnection('#img1', '#img2');
    drawConnection('#img2', '#img3');
    drawConnection('#img3', '#img4');
    drawConnection('#img4', '#img5');

    function drawConnection(elm1, elm2){
      var bentUpwardsOnScreen = -1;
      var bentDownwardOnScreen = 1;
      var curveRadius = 30;
      var pos = getPositionLeft(elm1);
      var posElm2 = getPositionRight(elm2);
      ctx.moveTo(pos.x, pos.y);

      var diffX = posElm2.x - pos.x;
      var diffY = posElm2.y - pos.y;
      var lengthStraightHorizontal = Math.floor( (diffX - curveRadius * 2 ) /2 );
      var lengthStraightVertical = Math.abs(diffY) - curveRadius * 2;
      var bendFactor = (diffY > 0) ? bentDownwardOnScreen : bentUpwardsOnScreen;

      //drawLineHorizontal(pos, lengthStraightHorizontal);
      drawLineHorizontal(pos, lengthStraightHorizontal);
      drawCurve(pos, bendFactor, true);
      drawLineVertical(pos, lengthStraightVertical, (diffY > 0 ? 1 : -1) );
      drawCurve(pos, bendFactor, false);
      drawLineHorizontal(pos, lengthStraightHorizontal);

      ctx.stroke();

      function drawLineHorizontal(pos, distance){
        pos.x = pos.x + distance;
        ctx.lineTo(pos.x, pos.y);
      }
      function drawLineVertical(pos, distance, directionFactor){
        pos.y = pos.y + directionFactor * distance;
        ctx.lineTo(pos.x, pos.y);
      }
      function drawCurve(pos, bendFactor, isHorizontalAtStart){
        var endX = pos.x + curveRadius;
        var endY = pos.y + bendFactor * curveRadius;

        var cx = 0 //Control-point x;
        var cy = 0 //Control-point y;
        if (isHorizontalAtStart){
          cx = endX
          cy = pos.y
        }else{
          cx = pos.x
          cy = endY
        }

        ctx.quadraticCurveTo( cx, cy, endX, endY );

        pos.x = endX;
        pos.y = endY;
      }

      function getPositionLeft(elm){
        return {
          x: Math.floor( $(elm).offset().left + $(elm).width())-3,
          y: Math.floor( $(elm).offset().top + $(elm).height()/2 )+0
        }
      }
      function getPositionRight(elm){
        return {
          x: Math.floor( $(elm).offset().left + $(elm).width())-10,
          y: Math.floor( $(elm).offset().top + $(elm).height()/2 )+0
        }
      }
    }
  })()
});
