import React from 'react';

function ImagePopup({card, onClose}) {

  return(
    <div className={`popup popup_type_image ${card.urls.regular ? "popup_opened" : "" }`}>
      <div className="popup__wrapper popup__wrapper_type_image">
        <button
          className="popup__close popup__close_type_image"
          type="button"
          aria-label="закрыть попап"
          onClick={onClose}
        ></button>
        <figure>
          <img
            className="popup__image"
            src={card.urls.regular}
            alt={card.alt_description}
          />
          <figcaption className="popup__caption">{card.alt_description}</figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;