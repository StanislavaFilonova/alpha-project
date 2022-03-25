import React from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import api from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import DeleteCardPopup from "./DeleteCardPopup.js";
import EditProfilePopup from "./EditProfilePopup.js";

//---------------------------------------------------------------------------------------------------------------------

function App() {
    //Создаем хуки, управляющие внутренним состоянием.
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isDeleteCardPopup, setIsDeleteCardPopup] = React.useState(false);

    const [selectedCard, setSelectedCard] = React.useState({
        link: "",
        name: "",
    });
    const [currentUser, setCurrentUser] = React.useState({});

    const [cards, setCards] = React.useState([]);
    const [cardDelete, setCardDelete] = React.useState({});

    const [profilePopupButtonText, setProfilePopupButtonText] =
        React.useState("Сохранить");
    const [avatarPopupButtonText, setAvatarPopupButtonText] =
        React.useState("Сохранить");
    const [placePopupButtonText, setPlacePopupButtonText] =
        React.useState("Создать");
    const [removePopupButtonText, setRemovePopupButtonText] =
        React.useState("Да");

    //---------------------------------------------------------------------------------------------------------------------

    //Создание обработчика события, который изменяет внутренне состояние
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

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
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
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
        api.getCards()
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
        const isLiked = card.likes.some((like) => like._id === currentUser._id);
        api.changeLike(card._id, !isLiked)
            .then((res) => {
                setCards((condition) =>
                    condition.map((currentCard) =>
                        currentCard._id === card._id ? res : currentCard
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            })
    }

    //  Функция удаления карточки: устанавливаем текст на кнопку при удалении карточки
    function handleCardDelete(card) {
        setRemovePopupButtonText("Удаление...");
        // Исключаем из массива удаленную карточку
 
        api.deleteCard(card._id)
            .then(() => {
                const newCards = cards.filter(
                    (currentCard) => currentCard._id !== card._id
                );
                // Обновляем состояние
                setCards(newCards);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setRemovePopupButtonText("Да");
            })
    }

    // Функция обновления пользователя
    function handleUpdateUser(user) {
        setProfilePopupButtonText("Сохранение...");
        api.editProfile(user)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setProfilePopupButtonText("Сохранить");
            })
    }

    // Функция обновления аватара
    function handleUpdateAvatar(avatar) {
        setAvatarPopupButtonText("Сохранение...");
        api.renewAvatar(avatar) // 1й аргумент с типом String (avatarLink в Api.js:renewAvatar)
            .then((avatar) => {
                setCurrentUser(avatar);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setAvatarPopupButtonText("Сохранить");
            }
        );
    }

    // Функция добавления места
    function handleAddPlaceSubmit(cardNew) {
        setPlacePopupButtonText("Добавление...");
        api.addCard(cardNew)
            .then((res) => {
                setCards([res, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
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
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDeleteClick}
                    cards={cards}
                />
                <Footer />
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    buttonSubmitText={profilePopupButtonText}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    buttonSubmitText={placePopupButtonText}
                    onAddPlace={handleAddPlaceSubmit}
                />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    buttonSubmitText={avatarPopupButtonText}
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
