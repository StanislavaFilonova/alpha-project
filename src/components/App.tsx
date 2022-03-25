import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import {api} from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";

//---------------------------------------------------------------------------------------------------------------------

function App() {
    //Создаем хуки, управляющие внутренним состоянием.
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isDeleteCardPopup, setIsDeleteCardPopup] = React.useState(false);

    const [selectedCard, setSelectedCard] = React.useState({
        link: "",
        name: "",
    });
    const [currentUser, setCurrentUser] = React.useState({});

    const [cards, setCards] = React.useState([]);
    const [cardDelete, setCardDelete] = React.useState({});

    const [placePopupButtonText, setPlacePopupButtonText] =
        React.useState("Создать");
    const [removePopupButtonText, setRemovePopupButtonText] =
        React.useState("Да");

    //---------------------------------------------------------------------------------------------------------------------

    //Создание обработчика события, который изменяет внутренне состояние

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleCardDeleteClick(card) {
        setIsDeleteCardPopup(true);
        setCardDelete(card);
    }

    //Функция закрытия всех попапов
    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setIsDeleteCardPopup(false);
        setCardDelete({ link: "", name: "" });
        setSelectedCard({ link: "", name: "" });
    }

    //---------------------------------------------------------------------------------------------------------------------

    // Настраиваем хук, который устанавливает колбэки. Функция будет вызвана после того, как будут внесены все изменения в DOM.
    // Функция, которая отвечает за закрытие попапов по клику вне формы
    React.useEffect(
        () => {
            function handleOverlayClick(evt) {
                if (evt.target.classList.contains("popup")) {
                    closeAllPopups();
                }
            }
            document.addEventListener("mousedown", handleOverlayClick);

            return () => {
                document.removeEventListener("mousedown", handleOverlayClick);
            };
        },
        // колбэк-очистка
        []
    );

    // Функция, которая отвечает за закрытие попапа нажатием кнопки "escape"
    React.useEffect(() => {
        function handleEscapeClick(evt) {
            if (evt.key === "Escape") {
                closeAllPopups();
            }
        }
        document.addEventListener("keyup", handleEscapeClick);

        return () => {
            document.removeEventListener("keyup", handleEscapeClick);
        };
    }, []);

    // Чтение данных с сервера (информация о пользователе)
    React.useEffect(() => {
        api.getUserInfo()
            .then((user) => {
                //console.log(user);
                setCurrentUser(user);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    React.useEffect(() => {
        // После получения идентификатора пользователя получим карточки
        api._getCards()
            // После получения карточек - нарисуем их
            .then((cards) => {
                //console.log(cards);
                setCards(cards);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    //---------------------------------------------------------------------------------------------------------------------
    // Установка лайка карточкам
    function handleCardLike(card) {
        // Ввод переменной, где мы проверяем при помощи метода some, удовлетворяет ли какой-либо элемент массива условию, заданному в передаваемой функции.
        const isLiked = card.likes.some((like: any, currentUser: any) => like._id === currentUser._id);
        // @ts-ignore: Object is possibly 'undefined'.
        api.changeLike(card._id, !isLiked)
            .then((res: any) => {
                setCards((condition: any) =>
                    condition.map((currentCard: any) =>
                        currentCard._id === card._id ? res : currentCard
                    )
                );
            })
            .catch((err: any) => {
                console.log(err);
            })
    }

    //  Функция удаления карточки: устанавливаем текст на кнопку при удалении карточки
    function handleCardDelete(card: any) {
        setRemovePopupButtonText("Удаление...");
        // Исключаем из массива удаленную карточку
        // @ts-ignore: Object is possibly 'undefined'.
        api.deleteCard(card._id)
            .then(() => {
                const newCards = cards.filter(
                    (currentCard: any) => currentCard._id !== card._id
                );
                // Обновляем состояние
                setCards(newCards);
                closeAllPopups();
            })
            .catch((err: any) => {
                console.log(err);
            })
            .finally(() => {
                setRemovePopupButtonText("Да");
            })
    }

    // Функция добавления места
    function handleAddPlaceSubmit(cardNew) {
        setPlacePopupButtonText("Добавление...");
        // @ts-ignore: Object is possibly 'undefined'.
        api.addCard(cardNew)
            .then((res: never) => {
                setCards([res, ...cards]);
                closeAllPopups();
            })
            .catch((err: any) => {
                console.log(err);
            })
            .finally(() => {
                setPlacePopupButtonText("Создать");
            })
    }

    //---------------------------------------------------------------------------------------------------------------------
    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                {" "}
                {/*текущее значение контекста из ближайшего подходящего Provider выше в дереве компонентов.*/}
                <Header />
                <Main
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDeleteClick}
                    cards={cards}
                />
                <Footer />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    buttonSubmitText={placePopupButtonText}
                    onAddPlace={handleAddPlaceSubmit}
                />

                <DeleteCardPopup
                    isOpen={isDeleteCardPopup}
                    onClose={closeAllPopups}
                    onSubmitDeleteCard={handleCardDelete}
                    card={cardDelete}
                    buttonSubmitText={removePopupButtonText}
                />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;
