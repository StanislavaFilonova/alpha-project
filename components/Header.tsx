// Импортируем изображение, чтобы оно отображалось на страничке

import React from 'react';
// @ts-ignore
import vector from '../images/bank.png';

/**
 *  Функция: Создание компонента Header, который отвечает за прорисовку логотипа на сайте
 */
function Header() {
    return (
        <header className="header">
            <img src={vector} alt="Логотип сервиса" className="header__logo"/>
        </header>
    );
}
// Экспорт компонента, чтобы потом можно было с ним работать
export default Header;