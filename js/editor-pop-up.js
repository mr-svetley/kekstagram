'use strict';

window.editorPopUp = (function () {
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
    window.util.isEscEvent(evt, closePhotoEditor);
  }

  function closePhotoEditor() {
    photoEditor.classList.add('hidden');
    photoEditorClose.removeEventListener('click', onPhotoEditorCloseClick);
    document.removeEventListener('keydown', onPhotoEditorEscPress);
    resetPhotoEditor();
  }

  function openPhotoEditor() {
    photoEditor.classList.remove('hidden');
    window.applyEffect();
    photoEditorClose.addEventListener('click', onPhotoEditorCloseClick);
    document.addEventListener('keydown', onPhotoEditorEscPress);
  }

  function resetPhotoEditor() {
    photoEditorForm.reset();
    photoEditor.querySelector('.img-upload__preview').style.transform = '';
    photoEditor.querySelector('.img-upload__preview img').className = '';
    window.slider.resetSlider();
  }

  return {
    photoEditor: photoEditor
  };
})();
