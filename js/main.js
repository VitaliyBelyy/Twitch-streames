
$(document).ready(function(){

  $('#search-submit').click(function() {
    $('#search-form').addClass('active');
    $('#search-text').fadeIn('slow').focus();
  });

  $('.filter .all').click(function() {
    $('.filter li a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-list li').fadeIn('100');
  });

  $('.filter .online').click(function() {
    $('.filter li a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-list li.online').fadeIn('100');
    $('#streamers-list li.offline').hide();
  });

  $('.filter .offline').click(function() {
    $('.filter li a').removeClass('active');
    $(this).addClass('active');
    $('#streamers-list li.offline').fadeIn('100');
    $('#streamers-list li.online').hide();
  });

  var usernames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

  usernames.forEach(function(username) {
    getDetails(username);
  });

  function getDetails(name) {
    $.getJSON('https://wind-bow.glitch.me/twitch-api/channels/'+name+'', function(data) {
      var logo = data.logo,
      channelLink = data.url,
      channelName = data.display_name;

      $.getJSON('https://wind-bow.glitch.me/twitch-api/streams/'+name+'', function(r) {
        var status = (r.stream == null) ? 'offline' : r.stream.channel.status;
        var liClass =  (r.stream == null) ? 'offline' : 'online';
        (logo == null) ? logo = 'images/default-user.png' : '';
        (status == null) ? status = '' : '';

        var streamersDetails = 
            '<a href="'+channelLink+'" class="info-wrapper clearfix">\
              <div class="thumbnail">\
                <img src="'+logo+'" alt="channel thumbnail">\
              </div>\
              <p id="channel-name">'+channelName+'</p>\
              <p class="status">'+status+'</p>\
            </a>';
              
        $('#streamers-list').append($('<li class="'+liClass+'"></li>').html(streamersDetails));
      });
    });                
  }

  var minlen = 3; // минимальная длина слова
  var paddingtop = 25; // отступ сверху при прокрутке
  var scrollspeed = 200; // время прокрутки
  var keyint = 0; // интервал между нажатиями клавиш
  var term = '';
  var n = 0;
  var time_keyup = 0;
  var time_search = 0;
 
  $('body').delegate('#search-submit', 'click', function(){
    $('body,html').animate({scrollTop: $('span.highlight:first').offset().top - paddingtop}, scrollspeed); // переход к первому фрагменту
  });

  function dosearch() {
    term = $('#search-text').val();
    $('span.highlight').each(function(){ //удаляем старую подсветку
      $(this).after($(this).html()).remove();  
    });
    var t = '';
    $('p#channel-name').each(function(){ // в селекторе задаем область поиска
      $(this).html($(this).html().replace(new RegExp(term, 'ig'), '<span class="highlight">$&</span>')); // выделяем найденные фрагменты
      n = $('span.highlight').length; // количество найденных фрагментов
      if (n>1) {// если больше одного фрагмента, то добавляем переход между ними
        var i = 0;
        $('span.highlight').each(function(i){
          $(this).attr('n', i++); // нумеруем фрагменты
        });
        $('span.highlight').not(':last').attr({title: 'Click to go to the next fragment'}).click(function(){ // всем фрагментам, кроме последнего, добавляем подсказку
          $('body,html').animate({scrollTop: $('span.highlight:gt('+$(this).attr('n')+'):first').offset().top-paddingtop}, scrollspeed); // переход к следующему фрагменту
        });
        $('span.highlight:last').attr({title: 'Click to return to the search form'}).click(function(){
          $('body,html').animate({scrollTop: $('#search-text').offset().top - paddingtop}, scrollspeed); // переход к форме поиска
        });
      } 
    });
  }

  $('#search-text').keyup(function(){
    var d1 = new Date();
    time_keyup = d1.getTime();
    if ($('#search-text').val()!=term) { // проверяем, изменилась ли строка
      if ($('#search-text').val().length>=minlen) { // проверяем длину строки
        setTimeout(function(){ // ждем следующего нажатия
          var d2 = new Date();
          time_search = d2.getTime();
          if (time_search-time_keyup>=keyint) { // проверяем интервал между нажатиями
            dosearch(); // если все в порядке, приступаем к поиску
          } 
        }, keyint); 
      }
    }
  });  

});


