'use strict';
window.applyEffect = (function () {
  var photoEditorImage = window.editorPopUp.photoEditor.querySelector('.img-upload__preview img');
  var photoEditorEffects = window.editorPopUp.photoEditor.querySelectorAll('.effects__radio ');
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
    effectName = effectName || window.editorPopUp.photoEditor.querySelector('.effects__radio:checked').value;
    var scale = document.querySelector('.img-upload__scale');
    scale.classList.toggle('hidden', effectName === 'none');
    if (value === DEFAULT_EFFECT_VALUE) {
      window.slider.resetSlider();
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

  return applyEffect;
})();

