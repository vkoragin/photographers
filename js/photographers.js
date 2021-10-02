"use strict";

/* 
	После загрузки страницы формируются и добавляются плашки с информацией о фотографах.	
	При нажатии на кнопку раскрытия загружается детальная информация.
	Если детальная информация уже была загружена в плашку, то при нажатии на кнопку раскрытия она просто отображается (заново не загружается)
	По умолчанию открыта первая плашка
*/

$(document).ready(function () {
  $.getJSON('/data/list.json', fillData);

  function fillData(data) {
    $.each(data, function (photographer, photographerInfo) {
      let infoHTML = '';
      let setActivitySatus = function setActivitySatus() {
        return photographerInfo["isActive"] ? 'online' : 'offline';
      };

      infoHTML += '<div class="photographer" data-id="' + photographerInfo["_id"] + '">';
      infoHTML +=   '<div class="photo">';
      infoHTML +=     '<img src="' + photographerInfo["picture"] + '" data-src="images/big/'+ photographerInfo["index"] +'.jpg" alt="">';
      infoHTML +=     '<div class="activity ' + setActivitySatus() + '">' + setActivitySatus() + '</div>';
      infoHTML +=     '<div class="info">';
      infoHTML +=       '<div class="name">' + photographerInfo["name"]["first"] + ' ' + photographerInfo["name"]["last"] + '</div>';
      infoHTML +=       '<div class="city">' + photographerInfo["city"] + '</div>';
      infoHTML +=     '</div>';
      infoHTML +=     '<div class="rating"><span></span><span></span><span></span><span></span><span></span></div>';
      infoHTML +=   '</div>';
      infoHTML +=   '<div class="details"></div>';
      infoHTML +=   '<div class="button"></div>';
      infoHTML += '</div>';
	  
      $('.photographers').append(infoHTML);
      setRating();

      function setRating() {
        let photographer = $('[data-id="' + photographerInfo["_id"] + '"]');
        let rating = photographer.find('.rating');

        for (let i = 0; i < photographerInfo["range"]; i++) {
          rating.find('span').eq(i).addClass('active');
        }
      }
    });
	
    $('.button:first').click();
  }

  $(document).on('click', '.button', function () {
    let openPhotographers = $('.open');
    let currentPhotographer = $(this).closest('.photographer');
	
    changeImage(openPhotographers);
	  $('.photographer').removeClass('open');

    if (currentPhotographer.hasClass('open')) {
      currentPhotographer.removeClass('open');
    } else {
      currentPhotographer.addClass('open');
      changeImage(currentPhotographer);
    }

    if (!currentPhotographer.hasClass('onload')) {
      $.getJSON('/data/detail.json', fillDetails);
    }

    function fillDetails(data) {
      let details = currentPhotographer.find('.details');
      let infoHTML = '';
	  
      infoHTML += '<div class="specialization">';
      infoHTML +=   '<h2 class="title">Specialization</h2>';
      infoHTML +=   '<ul class="list"></ul>';
      infoHTML += '</div>';
      infoHTML += '<div class="pictures"></div>';
	  
      details.append(infoHTML);
	  
      data["specialization"].map(function (item) {
        let infoHTML = '<li>' + item + '</li>';
        details.find('ul').append(infoHTML);
      });
	  
      data["pictures"].map(function (item) {
        let infoHTML = '';
		
        infoHTML += '<div class="picture"><img src="' + item["url"] + '" alt="">';
        infoHTML +=   '<div class="likes">';
        infoHTML +=     '<div class="ico"><img src="images/heart.png" alt=""></div>';
        infoHTML +=     '<div class="counter">' + item["likes"] + '</div>';
        infoHTML +=   '</div>';
        infoHTML += '</d iv>';
		
        details.find('.pictures').append(infoHTML);
      });
      currentPhotographer.addClass('onload');
    }
  });

  function changeImage(el) {
    let photo = el.find('.photo img');
    let smallImage = photo.attr('src');
    let bigImage = photo.attr('data-src');
	
    photo.attr('src', bigImage);
    photo.attr('data-src', smallImage);
  }
});