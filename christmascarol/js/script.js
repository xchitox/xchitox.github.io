(function($){
  var totalTime = 3000,
      step = 0.8,
      readyTime = 3,
      money = 0,
      bonus = 0,
      BGM = null;

  var currentMoneyPos = 0,
      pressing = false,
      pt = null,
      counter = null,
      gt = null;


  var moneyRise = function(e) {
    clearTimeout(pt);
    pt = setTimeout(function(){
      pressing = false;
    }, 100);

    if(pressing) {
      return;
    }

    if(e.keyCode == 13) {
      pressing = true;
      currentMoneyPos += step;

      money = Math.round(currentMoneyPos * 8 / 0.9);

      $("#money-bg").css({
        'transform': "translateY(-"+(currentMoneyPos)+"%)"
      });

      $("#amount .figure").text(money > 800 ? "800" : money);

      if(currentMoneyPos >= 90 || money >= 800) {
        doGameEnd();
      }
    }
  }

  var countDown = function() {
    counter = setInterval(function() {
      totalTime = totalTime - 1;
      $("#counter").text(totalTime / 100);

      if(totalTime <= 1000) {
        $("#counter").addClass('blink');
        BGM.rate(1.5);
      }

      if(totalTime <= 0) {
        WHISTLE.rate(2.0);
        WHISTLE.volume(4);
        WHISTLE.play();
        doGameEnd();
        clearInterval(counter);
      }
    }, 10);
  }

  var getReady = function() {
    $("#press-enter").hide();
    $("#get-ready").show();
    gt = setInterval(function() {
      $("#get-ready .count").text(--readyTime);
      if(readyTime <= 0) {
        clearInterval(gt);
        $("#get-ready").hide({
          done: function(){
            doGameStart();
          }
        });
      }
    }, 1000);
  }

  var doOpenLanding = function(e) {
    $(document).unbind('keypress');
    $("#page-landing").addClass('bounceOutUp animated');
    setTimeout(function(){
      $(document).keypress(doGetReady);
    }, 1000);
  }


  var doGetReady = function() {
    $(document).unbind('keypress');
    getReady();
  }

  var doGameStart = function() {
    $(document).keypress(moneyRise);
    BGM.rate(1.5);
    countDown();
  }

  var doGameEnd = function() {
    clearInterval(counter);
    $(document).unbind('keypress');
    BGM.volume(0.2);
    BGM.rate(1.0);

    var base = 100;

    if(money <= 750) {
      base -= Math.floor((money % 100) / 10) * 10;
      bonus = ((7 - Math.floor(money / 100)) * 100);

      if(base > 50) {
        bonus += 50;
        base -= 50;
      }
      bonus += Math.ceil(Math.random() * base);
    }

    if(bonus) {
      $("#page-game-over").addClass('has-bonus');
    }

    $("#page-game-over").addClass('animted bounceInDown show');

    // DRUM.play();
    $('.won > .figure').prop('Counter', 0).animate({
      Counter: money
    }, {
      duration: 2000,
      step: function(now) {
        $(this).text(Math.ceil(now));
      },
      done: function() {
        // DRUM.stop();
        SPLASH.play();
        if(bonus) {
          setTimeout(function() {
            $(".bonus-wrapper").addClass('animated bounceIn show');

            // DRUM.play();
            SPLASH.stop();
            $('.bonus > .b-figure').prop('Counter', 0).animate({
              Counter: bonus
            }, {
              duration: 2000,
              step: function(now) {
                $(this).text(Math.ceil(now));
              },
              done: function() {
                // DRUM.stop();
                SPLASH.play();
                setTimeout(function() {
                  $(".total").addClass('animated bounceIn show');

                  // DRUM.play();
                  SPLASH.stop();
                  $('.total > .t-figure').prop('Counter', 0).animate({
                    Counter: bonus + money
                  }, {
                    duration: 2000,
                    step: function(now) {
                      $(this).text(Math.ceil(now));
                    },
                    done: function() {
                      // DRUM.stop();
                      SPLASH.play();
                      $('.total').addClass('final-amount');
                      BGM.volume(1.0);
                      doFirework();
                    }
                  })
                }, 1000);
              }
            });
          }, 1000);
        } else {
          // DRUM.stop();
          SPLASH.play();
          $('.won').addClass('final-amount');
          BGM.volume(1.0);
          doFirework();
        }
      }
    });
  }

  var doInit = function() {
    $(document).unbind('keypress');
    $("#page-init").addClass('flipOutY animated');

    BGM.play();

    setTimeout(function(){
      $(document).keypress(doOpenLanding);
    }, 1000);
  }

  var doFirework = function() {
    $('#page-firework').addClass('show');
    $("#sky").attr('width', $(window).width()).attr('height', $(window).height());
    animate('#sky');
  }

  $(document).ready(function() {
    $(document).keypress(doInit);

    BGM = new Howl({
      src: [
        '../media/jingle-bells.mp3'
      ],
      loop: true,
      volume: 1.0
    });

    DRUM = new Howl({
      src: [
        '../media/drum.mp3'
      ],
      loop: true,
      volume: 1.0
    });

    SPLASH = new Howl({
      src: [
        '../media/splash.wav'
      ],
      loop: false,
      volume: 1.0
    });

    WHISTLE = new Howl({
      src: [
        '../media/whistle.wav'
      ],
      loop: false,
      volume: 1.0
    });
  })
})(jQuery);
