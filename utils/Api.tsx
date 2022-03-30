export class Api {

  private _baseUrl: any;
  private _headers: HeadersInit | undefined;
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  // Возврат ответа об ошибке от сервера
  _checkResponse(res) {
    if (res.ok) {
      // Метод .json принимает предоставленный JSON, строит его и отправляет его клиенту
      return res.json();
    }
    // Promise  позволяет создать обертку для значения, который еще не известен при создании промиса. Нужен дял асинхронных операций
    return Promise.reject(`Ошибка: ${res.statusText}, с кодом: ${res.status}`);
  }

  /**
   * Метод получения информации о пользователе с сервера 
   */
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/stanislavafilonova`, {
      headers: this._headers,
    })
      .then(this._checkResponse)
  }

  /**
   * Метод получения карточек с сервера 
   */
  _getCards() {
    return fetch(`${this._baseUrl}/photos`, {
      headers: this._headers,
    })
      .then(this._checkResponse)
  }

  /**
   * Метод загрузки новой карточки на сервер
   * @param {Object} cardData Данные о карточке
   * cardData.name {String}
   * cardData.link {String}
   */
  addCard(cardData) {
    if(!cardData.name) {
      console.error("Api.addCard в аргументе cardData не передано обязательное поле 'name'. Запрос не будет выполнен.");
      return;
    }
    if(!cardData.link) {
      console.error("Api.addCard в аргументе cardData не передано обязательное поле 'link'. Запрос не будет выполнен.");
      return;
    }

    const url = `${this._baseUrl}/collections/DHvWeKumP80/add`;
    const hdr = this._headers;
    //@ts-ignore: Object is possibly 'undefined'.
    hdr['Content-Type'] = 'application/json';

    const opts = {
      method: 'POST',
      headers: hdr,
      body: JSON.stringify({
        title: "Stasya Collection",
        description: "Stasya First Collection",
        private: false
      })
    };

    return fetch(url, opts)
      .then(this._checkResponse)
  }

  /**
   * Метод удаления карточки 
   * @param {String} cardId Индентификатор карточки 
   */
  deleteCard(cardId) {
    if(!cardId) {
      console.error("Api.deleteCard не передан обязательный аргумент cardId. Запрос не будет выполнен.");
      return;
    }
    const url = `${this._baseUrl}/photos/${cardId}`;
    const hdr = this._headers;
    //@ts-ignore: Object is possibly 'undefined'.
    hdr['Content-Type'] = 'application/json';
    const opts = {
      method: 'DELETE',
      headers: hdr
    };

    return fetch(url, opts)
      .then(this._checkResponse)
  }

  /**
   * Метод постановки/удаления лайка на карточку
   * @param {String} cardId Идентификатор карточки 
   */
  changeLike(cardId, like){
    if(!cardId) {
      console.error("Api.changeLike не передан обязательный аргумент cardId. Запрос не будет выполнен.");
      return;
    }

    const url = `${this._baseUrl}/photos/${cardId}/like`;
    const opts = {
      method: (like ? 'PUT' : 'DELETE'),
      headers: this._headers
    };

    return fetch(url, opts)
      .then(this._checkResponse)
  }
}

export const api = new Api({
  baseUrl: "https://api.unsplash.com",
  headers: {
    'Authorization': 'Client-ID 5_Thk5UPokkj3LlpG9NE5qt9g1NLCtgyWDtoGjECwi4',
    'Content-Type': 'application/json',
    'Accept-Version': 'v1'
  },
});
