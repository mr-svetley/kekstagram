'use strict';
window.photoZoom = (function () {
  var photoEditorZoomMin = window.editorPopUp.photoEditor.querySelector('.resize__control--minus');
  var photoEditorZoomPlus = window.editorPopUp.photoEditor.querySelector('.resize__control--plus');
  var photoEditorZoomInput = window.editorPopUp.photoEditor.querySelector('.resize__control--value');
  var photoEditorImage = window.editorPopUp.photoEditor.querySelector('.img-upload__preview');

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

    newZoomValue = Math.max(Math.min(newZoomValue, window.slider.VALUE_MAX), window.slider.VALUE_MIN);

    photoEditorZoomInput.value = newZoomValue + '%';
    photoEditorImage.style.transform = 'scale(' + (newZoomValue / 100) + ')';
  }

  return {

  };
})();

