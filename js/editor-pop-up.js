'use strict';

window.editorPopUp = (function () {
  var utils = window.utils;

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
    utils.isEscEvent(evt, closePhotoEditor);
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

  // ======================
  var photoEditorImage = photoEditor.querySelector('.img-upload__preview img');
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
      photoEditorImage.removeAttribute('style');
      photoEditorImage.className = '';
      photoEditorImage.classList.add('effects__preview--' + effectName);
    } else {
      switch (effectName) {
        case 'chrome':
          value /= 100;
          photoEditorImage.style.filter = 'grayscale(' + value + ')';
          break;
        case 'sepia':
          value /= 100;
          photoEditorImage.style.filter = 'sepia(' + value + ')';
          break;
        case 'marvin':
          photoEditorImage.style.filter = 'invert(' + value + '%)';
          break;
        case 'phobos':
          value = value * MAX_BLUR_VALUE / 100;
          photoEditorImage.style.filter = 'blur(' + value + 'px)';
          break;
        case 'heat':
          value = value * MAX_BRIGHTNESS_VALUE / 100;
          photoEditorImage.style.filter = 'brightness(' + value + ')';
          break;
        case 'none':
          break;
        default:
          throw new TypeError('Invalid "effectName" argument: ' + effectName);
      }
    }
  }

  // ============================
  var VALUE_MIN = 0;
  var VALUE_MAX = 100;

  var photoEditorPin = photoEditor.querySelector('.scale__pin');
  photoEditorPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
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
      }

      if (moveEvt.clientX > scaleLineX2 || value > VALUE_MAX) {
        value = VALUE_MAX;
      } else if (moveEvt.clientX < scaleLineX1 || value < VALUE_MIN) {
        value = VALUE_MIN;
      }

      photoEditorPin.style.left = value + '%';
      scaleLevel.style.width = value + '%';
      scaleInput.value = Math.round(value);
      applyEffect(Number(value));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function resetSlider() {
    photoEditor.querySelector('.scale__pin').style.left = VALUE_MAX + '%';
    document.querySelector('.scale__level').style.width = VALUE_MAX + '%';
    document.querySelector('.scale__value').value = VALUE_MAX;
  }

  return {
    photoEditor: photoEditor,
  };
})();
