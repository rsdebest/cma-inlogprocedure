function log(x){console.log(x)}

function debug(x){
  $('#debug').html('<p>'+x+'</p>');
}
$(window).load(function(){

  var hammertime      = $('.toucharea').hammer({
    prevent_default: true
  });

  var scrollPosition  = 0;
  var pageCount       = 5;
  var pageNumber      = 1;
  var moveLeft        = -1;
  var moveRight       = 1;
  var isAnimating     = false;
  var pageWidth, spacerWidth, scrollWidth;

  //document.ontouchmove = function(e) {e.preventDefault()};

  initDimensions = function(){
    log("initDimension called. Dimension start @ pageWidth " + pageWidth +  " spacerWidth " + spacerWidth);
    pageWidth = $('.page').width();
    spacerWidth = $('.spacer').width();
    scrollWidth = pageWidth + spacerWidth;
    log("initDimension called. Dimension set to pageWidth " + pageWidth +  " spacerWidth " + spacerWidth);
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
      }else{
        pageNumber += direction;
      }

      log("PageNumber: " + pageNumber);

      scrollPosition = $(document).scrollLeft();
      $("body")
        .stop()
        .animate({
          "scrollLeft": (scrollPosition + direction * scrollWidth)
        }
        ,1000
        ,function(){
          isAnimating = false;
        }
      );
    }

  }

  hammertime.on("swipeleft", getOnSwipeCallback(moveRight));
  hammertime.on("swiperight", getOnSwipeCallback(moveLeft));

  /*
  hammertime.on("release", function(e,v){

    var navDirection = e.gesture.direction == "left" ? moveRight:moveLeft;
    var distance = e.gesture.distance;
    if (distance > 200){
      //Navigeer naar volgende pagina
      var newScrollPosition = (pageNumber + navDirection) * scrollWidth;
      $("body").animate({
        "scrollLeft": newScrollPosition
      });
      pageNumber += navDirection;
    }
    else{
      //Snap terug naar oude pagina
      var newScrollPosition = pageNumber * scrollWidth;
      $("body").animate({
        "scrollLeft": newScrollPosition
      });
    }

    log('released')
    log(e)
  })       */

  $(window).bind("orientationchange", function(evt){
    log("orientation changed");
    initDimensions();
    var scrollPosition = (pageNumber - 1) * scrollWidth;
    $("body").scrollLeft(scrollPosition);
  });
});

$(window).load(function() {

  (function DrawConnectionsBetweenImages(){
    var pos = {x: 0, y: 0};
    var curveRadius = 30;
    var buigNaarBoven = -1;
    var buigNaarOnder = 1;

    var highestBottomY = Math.max.apply(null,
      $('#img1,#img2,#img3,#img4').map(function(index,elm){
        return Math.floor( $(elm).offset().top + $(elm).width() );
      }).toArray());
    var height = highestBottomY + 10;
    var width = $('#img4').offset().left + 10;

    var ctx = $('canvas').get(0).getContext('2d');
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    drawConnection('#img1', '#img2');
    drawConnection('#img2', '#img3');
    drawConnection('#img3', '#img4');
    ctx.stroke();

    function drawConnection(elm1, elm2){
      pos = getPosition(elm1);
      posElm2 = getPosition(elm2);
      ctx.moveTo(pos.x, pos.y);

      var diffX = posElm2.x - pos.x;
      var diffY = posElm2.y - pos.y;
      var lengthStraightHorz = Math.floor( (diffX - curveRadius * 2 ) /2 );
      var lengthStraightVert = Math.abs(diffY) - curveRadius * 2;
      var buigFactor = (diffY > 0) ? buigNaarOnder : buigNaarBoven;

      drawLineHorizontal(lengthStraightHorz);
      drawCurve(buigFactor, true);
      drawLineVertical(lengthStraightVert, (diffY > 0 ? 1 : -1) );
      drawCurve(buigFactor, false);
      drawLineHorizontal(lengthStraightHorz);

      pos.x = posElm2.x;
      pos.y = posElm2.y;
    }

    function drawLineHorizontal(distance){
      pos.x = pos.x + distance;
      ctx.lineTo(pos.x, pos.y);
    }
    function drawLineVertical(distance, directionFactor){
      pos.y = pos.y + directionFactor * distance;
      ctx.lineTo(pos.x, pos.y);
    }
    function drawCurve(buigFactor, isHorizontaalAanBegin){
      var endX = pos.x + curveRadius;
      var endY = pos.y + buigFactor * curveRadius;

      var cx = 0 //Control-point x;
      var cy = 0 //Control-point y;
      if (isHorizontaalAanBegin){
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
    function getPosition(elm){
      return {
        x: Math.floor( $(elm).offset().left + $(elm).width()/2),
        y: Math.floor( $(elm).offset().top + $(elm).height()/2 )
      }
    }
  })()
});
