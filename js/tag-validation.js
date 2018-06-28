'use strict';

window.tagValidation = (function () {
  var utils = window.utils;

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
    utils.isEscEvent(evt, evt.stopPropagation);
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
})();


