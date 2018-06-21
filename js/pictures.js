'use strict';

var ESC_KEYCODE = 27;

// Вывод превьюшек
// =============================================================
var photosData = generatePhotosData();
var photosLayout = generatePhotosLayout(photosData);
document.querySelector('.pictures').appendChild(photosLayout);

function generatePhotosLayout(currentPhotosData) {
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var photos = document.createDocumentFragment();

  currentPhotosData.forEach(function (photoData, index) {
    var photo = photoTemplate.cloneNode(true);
    // photo.setAttribute('data-id', index);
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
      likes: getRandomInteger(200, 15),
      comments: Array.from({length: getRandomInteger(2, 1)}, function () {
        return COMMENTS[getRandomInteger(COMMENTS.length - 1)];
      }),
      description: DESCRIPTIONS[getRandomInteger(DESCRIPTIONS.length - 1)]
    };
  });
}

function getRandomInteger(max, min) {
  min = min || 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Открытие/закрытие окна редактирования фото
// =============================================================
var photoEditorForm = document.querySelector('#upload-select-image');
var photoEditor = photoEditorForm.querySelector('.img-upload__overlay');
var photoInput = photoEditorForm.querySelector('#upload-file');
var photoEditorClose = photoEditor.querySelector('#upload-cancel');

photoInput.addEventListener('change', function () {
  openPhotoEditor();
});

function onPhotoEditorCloseClick() {
  closePhotoEditor();
}

function onPhotoEditorEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhotoEditor();
  }
}

function closePhotoEditor() {
  photoEditor.classList.add('hidden');
  photoEditorClose.removeEventListener('click', onPhotoEditorCloseClick);
  document.removeEventListener('keydown', onPhotoEditorEscPress);
  resetPhotoEditor();
}

function openPhotoEditor() {
  photoEditor.classList.remove('hidden');
  applyEffect();
  photoEditorClose.addEventListener('click', onPhotoEditorCloseClick);
  document.addEventListener('keydown', onPhotoEditorEscPress);
}

function resetPhotoEditor() {
  photoEditorForm.reset();
  photoEditor.querySelector('.img-upload__preview').style.transform = '';
  photoEditor.querySelector('.img-upload__preview img').className = '';
  resetSlider();
}

// Зумирование фото
// =============================================================
var photoEditorZoomMin = photoEditor.querySelector('.resize__control--minus');
var photoEditorZoomPlus = photoEditor.querySelector('.resize__control--plus');
var photoEditorZoomInput = photoEditor.querySelector('.resize__control--value');
var photoEditorImage = photoEditor.querySelector('.img-upload__preview');

photoEditorZoomMin.addEventListener('click', function () {
  zoomPhoto('out');
});

photoEditorZoomPlus.addEventListener('click', function () {
  zoomPhoto('in');
});

function zoomPhoto(type) {
  var ZOOM_STEP = 25;
  var currentZoomValue = parseInt(photoEditorZoomInput.value, 10);
  var newZoomValue;

  if (type === 'in') {
    newZoomValue = currentZoomValue + ZOOM_STEP;
  } else if (type === 'out') {
    newZoomValue = currentZoomValue - ZOOM_STEP;
  } else {
    throw new TypeError('Invalid "type" argument: ' + type);
  }

  newZoomValue = Math.max(Math.min(newZoomValue, VALUE_MAX), VALUE_MIN);

  photoEditorZoomInput.value = newZoomValue + '%';
  photoEditorImage.style.transform = 'scale(' + (newZoomValue / 100) + ')';
}

// Наложение эффектов на фото
// =============================================================
var photoEditorImg = photoEditorImage.querySelector('img');
var photoEditorEffects = photoEditor.querySelectorAll('.effects__radio ');
var MAX_BLUR_VALUE = 3;
var MAX_BRIGHTNESS_VALUE = 3;
var DEFAULT_EFFECT_VALUE = 100;

photoEditorEffects.forEach(function (effectInput) {
  effectInput.addEventListener('click', function () {
    var effect = effectInput.value;
    applyEffect(DEFAULT_EFFECT_VALUE, effect);
  });
});

function applyEffect(value, effectName) {
  if (value === undefined) {
    value = DEFAULT_EFFECT_VALUE;
  }
  effectName = effectName || photoEditor.querySelector('.effects__radio:checked').value;
  var scale = document.querySelector('.img-upload__scale');
  scale.classList.toggle('hidden', effectName === 'none');
  if (value === DEFAULT_EFFECT_VALUE) {
    resetSlider();
    photoEditorImg.removeAttribute('style');
    photoEditorImg.className = '';
    photoEditorImg.classList.add('effects__preview--' + effectName);
  } else {
    switch (effectName) {
      case 'chrome':
        value /= 100;
        photoEditorImg.style.filter = 'grayscale(' + value + ')';
        break;
      case 'sepia':
        value /= 100;
        photoEditorImg.style.filter = 'sepia(' + value + ')';
        break;
      case 'marvin':
        photoEditorImg.style.filter = 'invert(' + value + '%)';
        break;
      case 'phobos':
        value = value * MAX_BLUR_VALUE / 100;
        photoEditorImg.style.filter = 'blur(' + value + 'px)';
        break;
      case 'heat':
        value = value * MAX_BRIGHTNESS_VALUE / 100;
        photoEditorImg.style.filter = 'brightness(' + value + ')';
        break;
      case 'none':
        break;
      default:
        throw new TypeError('Invalid "effectName" argument: ' + effectName);
    }
  }
}

// Слайдер глубины эффекта
// =============================================================
var VALUE_MIN = 0;
var VALUE_MAX = 100;

function resetSlider() {
  photoEditor.querySelector('.scale__pin').style.left = VALUE_MAX + '%';
  document.querySelector('.scale__level').style.width = VALUE_MAX + '%';
  document.querySelector('.scale__value').value = VALUE_MAX;
}

var photoEditorPin = photoEditor.querySelector('.scale__pin');
photoEditorPin.addEventListener('mousedown', function (evt) {
  var scaleInput = document.querySelector('.scale__value');
  var scaleLine = document.querySelector('.scale__line');
  var scaleLevel = document.querySelector('.scale__level');
  var scaleLineWidth = scaleLine.offsetWidth;
  var scaleLineParam = scaleLine.getBoundingClientRect();
  var scaleLineX1 = scaleLineParam.x;
  var scaleLineX2 = scaleLineParam.x + scaleLineWidth;
  var onePercent = scaleLineWidth / 100;
  var startXCoords = evt.clientX;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    if (moveEvt.clientX >= scaleLineX1 && moveEvt.clientX <= scaleLineX2) {
      var shift = startXCoords - moveEvt.clientX;

      startXCoords = moveEvt.clientX;

      var value = (photoEditorPin.offsetLeft - shift) / onePercent;

      if (value > VALUE_MAX) {
        value = VALUE_MAX;
      } else if (value < VALUE_MIN) {
        value = VALUE_MIN;
      }

      photoEditorPin.style.left = value + '%';
      scaleLevel.style.width = value + '%';
      scaleInput.value = Math.round(value);
      applyEffect(Number(value));
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// Открытие/закрытие окна просмотра фото
// =============================================================
var photoContainer = document.querySelector('.pictures');

var photoViever = document.querySelector('.big-picture');
var photoVieverClose = document.querySelector('#picture-cancel');

photoContainer.addEventListener('click', onPhotoContainerClick);
function onPhotoContainerClick(evt) {
  var target = evt.target.closest('.picture__link');
  var photoId = target.dataset.id;
  var photoData = photosData[photoId];
  openPhotoViewer(photoData);
}

function openPhotoViewer(photoData) {
  var photoVieverImg = photoViever.querySelector('.big-picture__img img');
  var photoVieverCommentCount = photoViever.querySelector('.comments-count');
  var photoVieverLikesCount = photoViever.querySelector('.likes-count');
  var photoVieverCaption = photoViever.querySelector('.social__caption');
  var photoVieverCommentsList = document.querySelector('.social__comments');

  photoVieverImg.src = photoData.url;
  photoVieverCommentCount.textContent = photoData.comments.length;
  photoVieverLikesCount.textContent = photoData.likes;
  photoVieverCaption.textContent = photoData.description;
  photoVieverCommentsList.innerHTML = '';

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

  photoVieverCommentsList.appendChild(comments);

  photoVieverClose.addEventListener('click', onPhotoVieverCloseClick);
  document.addEventListener('keydown', onPhotoVieverEscPress);

  photoViever.classList.remove('hidden');
}

function closePhotoViewer() {
  photoViever.classList.add('hidden');
  photoVieverClose.removeEventListener('click', onPhotoVieverCloseClick);
  document.removeEventListener('keydown', onPhotoVieverEscPress);
}

function onPhotoVieverCloseClick() {
  closePhotoViewer();
}

function onPhotoVieverEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePhotoViewer();
  }
}

// Валидация хэш-тегов
// ===============================================================
var hashTagInput = document.querySelector('.text__hashtags');
var MAX_TAG_LENGHT = 20;
var ERROR_TOO_MUCH = 'Не больше пяти хэш-тегов';
var ERROR_TOO_LONG = 'Хэш-тег не может быть длиннее 20 символов';
var ERROR_TAG_REPEAT = 'Хэш-теги не должны повторяться (#tAg = #tag)';
var ERROR_NO_TAG = 'Хэш-тег должен начинаться с # и не содержать других #';
var ERROR_NO_NAME_TAG = 'После # должно быть имя тега';

hashTagInput.addEventListener('change', function (evt) {
  validateHashTagInput(evt.target);
});

hashTagInput.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
});

function isContainIncorrectTag(tagArray) {
  return tagArray.some(function (currentTag) {
    return !(currentTag.startsWith('#')) || (currentTag.indexOf('#', 1) !== -1);
  });
}

function isContainTooLongTag(tags) {
  return tags.some(function (currentString) {
    return (currentString.length > MAX_TAG_LENGHT);
  });
}

function isContainRepeatTag(tags) {
  var obj = {};
  tags.forEach(function (currentTag) {
    obj[currentTag] = currentTag;
  });
  return (Object.keys(obj).length !== tags.length);
}

function isContainNoNameTag(tags) {
  return tags.some(function (currentTag) {
    return currentTag.startsWith('#') && (currentTag.length === 1);
  });
}

function validateHashTagInput(input) {
  var tags = input.value
    .split(' ')
    .filter(Boolean);
  input.value = tags.join(' ');
  tags = tags.map(function (current) {
    return current.toLowerCase();
  });

  switch (true) {
    case (tags.length > 5):
      input.setCustomValidity(ERROR_TOO_MUCH);
      break;
    case (isContainTooLongTag(tags)):
      input.setCustomValidity(ERROR_TOO_LONG);
      break;
    case (isContainNoNameTag(tags)):
      input.setCustomValidity(ERROR_NO_NAME_TAG);
      break;
    case (isContainIncorrectTag(tags)):
      input.setCustomValidity(ERROR_NO_TAG);
      break;
    case (isContainRepeatTag(tags)):
      input.setCustomValidity(ERROR_TAG_REPEAT);
      break;
    default:
      input.setCustomValidity('');
  }
}
