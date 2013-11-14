function log(x){console.log(x)}

function debug(x){
  $('#debug').html('<p>'+x+'</p>');
}
$(window).load(function(){

  var hammertime      = $('.toucharea').hammer({
    prevent_default: true,
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
    pageWidth = $('.page').width();
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
    initDimensions();
    var scrollPosition = (pageNumber - 1) * scrollWidth;
    $("body").scrollLeft(scrollPosition);
  });
});



  $(window).load(function() {

    var width  = 8000;
    var height = 700;

    var ctx = $('canvas').get(0).getContext('2d');
    ctx.canvas.width  = width;
    ctx.canvas.height = height;



    drawit($('#img1').offset().left, $('#img1').offset().top, $('#img2').offset().left, $('#img2').offset().top, 'yellow')


    function drawit(startX,startY,endX,endY, color){
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    //ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    return;

    diffX = startX - endX;
    diffY = startY - endY;

    ctx.moveTo(startX,startY);
    ctx.quadraticCurveTo(
    startX+50,div2y+0,
    div2x+50,div2y+50);
    ctx.stroke();
    }
  });