'use strict';
window.viewerPopUp = (function () {
  var utils = window.utils;

  var photoContainer = document.querySelector('.pictures');
  var photoViever = document.querySelector('.big-picture');
  var photoVieverClose = document.querySelector('#picture-cancel');

  photoContainer.addEventListener('click', onPhotoContainerClick);
  function onPhotoContainerClick(evt) {
    var target = evt.target.closest('.picture__link');
    if (target) {
      var photoId = target.dataset.id;
      var photoData = window.thumb.data[photoId];
      openPhotoViewer(photoData);
    }
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
      commentImg.src = 'img/avatar-' + utils.generareRandomInteger(6, 1) + '.svg';
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
    utils.isEscEvent(evt, closePhotoViewer);
  }
})();

