import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

//---------------------------------------------------------------------------------------------------------------------

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser: any = React.useContext(CurrentUserContext);

  
  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.user.id === currentUser.id;
  
  function handleClick(){
    onCardClick(card);
  };

  function handleLike(){
    onCardLike(card);
  };

  function handleDelete(){
    onCardDelete(card);
  };
    
  //---------------------------------------------------------------------------------------------------------------------

  return(
    <li className="card" key={'card'}>
      <img className="card__photo" src={card.urls.regular} alt={card.alt_description} onClick={handleClick}/>
        <div className="card__info">
          <h2 className="card__name">{`${card.alt_description ? card.alt_description : 'Нет описания'}`}</h2>
          <div className="card__rate">
              <button className={`card__like ${card.liked_by_user ? 'card__like_active' : ''}`} type="button" onClick={handleLike} title="Нравится"></button>
              <h3 className="card__number">{card.likes}</h3>
          </div>
            <button className="card__delete" type="button" disabled={!isOwn} hidden={!isOwn}
              onClick={handleDelete}
              title="Удалить"></button>
        </div>
    </li>
  )
}

export default Card;