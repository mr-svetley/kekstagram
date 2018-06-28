'use strict';

window.utils = (function () {
  var ESC_KEYCODE = 27;

  return {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    generareRandomInteger: function (max, min) {
      min = min || 0;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };
})();
