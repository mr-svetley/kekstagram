'use strict';

var photosData = generatePhotosData();
var photosLayout = generatePhotosLayout(photosData);

document.querySelector('.pictures').appendChild(photosLayout);

openPhotoViewer(photosData[0]);

/**
 * Открывает окно просмотра с переданной фотографией
 *
 * @param {object} photoData Данные фотографии, которые необходимо отобразить
 */
function openPhotoViewer(photoData) {
  var photoViever = document.querySelector('.big-picture');

  photoViever.querySelector('.big-picture__img img').src = photoData.url;
  photoViever.querySelector('.comments-count').textContent = photoData.comments.length;
  photoViever.querySelector('.likes-count').textContent = photoData.likes;
  photoViever.querySelector('.social__caption').textContent = photoData.description;

  var commentsList = document.querySelector('.social__comments');
  commentsList.innerHTML = '';

  var comments = document.createDocumentFragment();

  photoData.comments.forEach(function (comment) {
    var commentLayout = document.createElement('li');
    commentLayout.classList.add('social__comment', 'social__comment--text');

    var commentImg = new Image(35, 35);
    commentImg.src = 'img/avatar-' + getRandomInteger(6, 1) + '.svg';
    commentImg.classList.add('social__picture');
    commentImg.alt = 'Аватар комментатора фотографии';

    var commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = comment;

    commentLayout.appendChild(commentImg);
    commentLayout.appendChild(commentText);

    comments.appendChild(commentLayout);
  });

  commentsList.appendChild(comments);

  photoViever.classList.remove('hidden');
}

/**
 * Создает html-разметку на основе переданных данных
 *
 * @param {Object[]} currentPhotosData Массив объектов с данными по каждому фото
 * @return {documentFragment} Разметка на основе принятых данных
 */
function generatePhotosLayout(currentPhotosData) {
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var photos = document.createDocumentFragment();

  currentPhotosData.forEach(function (photoData) {
    var photo = photoTemplate.cloneNode(true);
    photo.querySelector('.picture__img').src = photoData.url;
    photo.querySelector('.picture__stat--comments').textContent = photoData.comments.length;
    photo.querySelector('.picture__stat--likes').textContent = photoData.likes;
    photos.appendChild(photo);
  });

  return photos;
}

/**
 * Генерирует массив данных для фото-карточек
 *
 * @param {number} number Количество элементов для генирации
 * @return {Object[]} Массив со сгенерированными объектами
 */
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

  return Array.from({length: number}, function (_, index) {
    return {
      url: 'photos/' + (index + 1) + '.jpg',
      likes: getRandomInteger(200, 15),
      comments: Array.from({length: getRandomInteger(2, 1)}, function (__) {
        return COMMENTS[getRandomInteger(COMMENTS.length - 1)];
      }),
      description: DESCRIPTIONS[getRandomInteger(DESCRIPTIONS.length - 1)]
    };
  });
}

/**
 * Возвращяет целое число из заданого отрезка
 *
 * @param {number} max Максимальное число
 * @param {number} min Минимальное число (по умолчанию 0)
 * @return {number} Случайное целое число ( min <= x <= max )
 */
function getRandomInteger(max, min) {
  min = min || 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
