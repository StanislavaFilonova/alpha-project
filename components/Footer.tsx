import React from "react";

/**
 *  Функция: Создание компонента Footer, который отвечает за прорисовку футера на сайте
 */
 const date = new Date().getFullYear();
function Footer() {
    
    return(
        <footer className="footer">
            <p className="footer__author">&copy;{date}&nbsp;Filonova Stanislava</p>
        </footer>
    );
}

export default Footer;
