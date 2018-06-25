'use strict';
window.slider = (function () {
  var VALUE_MIN = 0;
  var VALUE_MAX = 100;

  var photoEditorPin = window.editorPopUp.photoEditor.querySelector('.scale__pin');
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
      window.applyEffect(Number(value));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  return {
    VALUE_MAX: VALUE_MAX,
    VALUE_MIN: VALUE_MIN,
    resetSlider: function () {
      window.editorPopUp.photoEditor.querySelector('.scale__pin').style.left = VALUE_MAX + '%';
      document.querySelector('.scale__level').style.width = VALUE_MAX + '%';
      document.querySelector('.scale__value').value = VALUE_MAX;
    }
  };
})();

