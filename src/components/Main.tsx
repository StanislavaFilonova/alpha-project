import React from 'react';
import Card from './Card';
//import CurrentUserContext from '../contexts/CurrentUserContext';

function Main({onCardClick, onCardLike, onCardDelete, cards}) {
    //const currentUser = React.useContext(CurrentUserContext);
    //---------------------------------------------------------------------------------------------------------------------

    return(
        <main className="content">
            <section className="elements">
                
                {cards.map((card) => (
                    <Card 
                        key={card.id}
                        card={card}
                        onCardClick={onCardClick}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete}
                    />
                    )
                )}
            </section>
        </main>
    );
}


export default Main;