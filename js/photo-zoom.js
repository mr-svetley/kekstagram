'use strict';
window.photoZoom = (function () {
  var editorPopUp = window.editorPopUp;

  var ZOOM_MIN = 25;
  var ZOOM_MAX = 100;
  var ZOOM_STEP = 25;

  var photoEditorZoomMin = editorPopUp.photoEditor.querySelector('.resize__control--minus');
  var photoEditorZoomPlus = editorPopUp.photoEditor.querySelector('.resize__control--plus');
  var photoEditorZoomInput = editorPopUp.photoEditor.querySelector('.resize__control--value');
  var photoEditorImage = editorPopUp.photoEditor.querySelector('.img-upload__preview');

  photoEditorZoomMin.addEventListener('click', function () {
    zoomPhoto('out');
  });

  photoEditorZoomPlus.addEventListener('click', function () {
    zoomPhoto('in');
  });

  function zoomPhoto(type) {
    var currentZoomValue = parseInt(photoEditorZoomInput.value, 10);
    var newZoomValue;

    if (type === 'in') {
      newZoomValue = currentZoomValue + ZOOM_STEP;
    } else if (type === 'out') {
      newZoomValue = currentZoomValue - ZOOM_STEP;
    } else {
      throw new TypeError('Invalid "type" argument: ' + type);
    }

    newZoomValue = Math.max(Math.min(newZoomValue, ZOOM_MAX), ZOOM_MIN);

    photoEditorZoomInput.value = newZoomValue + '%';
    photoEditorImage.style.transform = 'scale(' + (newZoomValue / 100) + ')';
  }
})();

