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

  $(window).bind("resize", function(evt){
    log("window resize");
    initDimensions();
    var scrollPosition = (pageNumber - 1) * scrollWidth;
    $("body").scrollLeft(scrollPosition);
  });
});