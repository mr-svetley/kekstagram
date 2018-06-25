'use strict';

window.thumb = (function () {
  var photosData = generatePhotosData();
  var photosLayout = generatePhotosLayout(photosData);
  document.querySelector('.pictures').appendChild(photosLayout);

  function generatePhotosLayout(currentPhotosData) {
    var photoTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
    var photos = document.createDocumentFragment();

    currentPhotosData.forEach(function (photoData, index) {
      var photo = photoTemplate.cloneNode(true);
      photo.dataset.id = index;
      photo.querySelector('.picture__img').src = photoData.url;
      photo.querySelector('.picture__stat--comments').textContent = photoData.comments.length;
      photo.querySelector('.picture__stat--likes').textContent = photoData.likes;
      photos.appendChild(photo);
    });

    return photos;
  }

  function generatePhotosData(number) {
    number = number || 25;
    var COMMENTS = [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
    ];

    var DESCRIPTIONS = [
      'Тестим новую камеру!',
      'Затусили с друзьями на море',
      'Как же круто тут кормят',
      'Отдыхаем...',
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!'
    ];

    return Array.from({length: number}, function (_currentItem, index) {
      return {
        url: 'photos/' + (index + 1) + '.jpg',
        likes: window.util.getRandomInteger(200, 15),
        comments: Array.from({length: window.util.getRandomInteger(2, 1)}, function () {
          return COMMENTS[window.util.getRandomInteger(COMMENTS.length - 1)];
        }),
        description: DESCRIPTIONS[window.util.getRandomInteger(DESCRIPTIONS.length - 1)]
      };
    });
  }
  return {
    data: photosData
  };
})();
