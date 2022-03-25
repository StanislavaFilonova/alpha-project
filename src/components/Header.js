// Импортируем изображение, чтобы оно отображалось на страничке
import vector from '../images/vector.svg';

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