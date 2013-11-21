$(window).on('load',function(){

  //requestAnimationFrame and cancel polyfill
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());
})

$(window).on('load',function(){

  (function() {

    var container = $('#content');
    var pageWidth;
    var pageCount = $('.page').length;
    var pageCurrent = 0;
    var spacerWidth;
    var containerWidth;
    setDimensions();

    $('body')
      .hammer({ drag_lock_to_axis: true })
      .on('release dragleft dragright swipeleft swiperight', SwipeHandler);

    $(window).on('resize orientationchange', function() {
      setpageDimensions();
    })

    function setDimensions(){
      pageWidth = $('.page').width();
      spacerWidth = $('.spacer').width();
      containerWidth = container.width();
    }

    function SwipeHandler(ev) {
      ev.gesture.preventDefault();// disable browser scrolling
      //log(ev);

      switch(ev.type) {
        case 'dragright':
        case 'dragleft':
          // stick to the finger
          var dragDistance = ev.gesture.deltaX;

          // Slow down drag animation;
          if((pageCurrent == 0 && ev.gesture.direction == Hammer.DIRECTION_RIGHT) ||
            (pageCurrent == pageCount-1 && ev.gesture.direction == Hammer.DIRECTION_LEFT)) {
            dragDistance *= .4;
          }

          moveToPosition(getPagePosition(pageCurrent) - dragDistance, false);
          break;

        case 'swipeleft':
          moveToPage(pageCurrent+1);
          ev.gesture.stopDetect();
          break;

        case 'swiperight':
          moveToPage(pageCurrent-1);
          ev.gesture.stopDetect();
          break;

        case 'release':
          // Often, the swipe event has preceded this event;
          // If more then 40% moved, navigate to appropriate page;
          if(Math.abs(ev.gesture.deltaX) > 0.4 * pageWidth) {
            if(ev.gesture.direction == 'right') moveToPage(pageCurrent-1); else moveToPage(pageCurrent+1);
          }
          else {
            moveToPage(pageCurrent);
          }
          break;
      }

      function moveToPage( indexPage ) {
        indexPage = Math.max(0, Math.min(indexPage, pageCount-1)); // Constrain indexPage between the bounds
        pageCurrent = indexPage; //Update global pageCurrent variable;

        $('.page').removeClass('active');
        $('page').eq(indexPage).addClass('active');

        moveToPosition(getPagePosition(indexPage), true);
      }

      function moveToPosition(xPosition, animate) {
        container.toggleClass('animate', animate); //Set class which sets the transition duration;
        var xPercentage = - (100/containerWidth) * xPosition;

        if(Modernizr.csstransforms3d) {
          container.css('transform', 'translate3d(' + xPercentage +'%,0,0) scale3d(1,1,1)');
        }
        else if(Modernizr.csstransforms) {
          container.css('transform', 'translate('+ xPercentage +'%,0)');
        }
        else {
          container.css('left',(-xPosition)+'px');
        }
      }

      function getPagePosition(pageIndex){
        return pageIndex * (pageWidth + spacerWidth);
      }
    }

  }())

})
