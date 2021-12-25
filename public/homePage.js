"use strict";

let logoutButton = new LogoutButton();
let rateBoard = new RatesBoard();
let moneyManager = new MoneyManager();
let favoritesWidget = new FavoritesWidget();

function show(response, message) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, message);
    } else {
        moneyManager.setMessage(false, `Произошла ошибка ${response.error}`);
    }
}

//Профиль
let current = ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    } else {
        console.error('Ошибка вывода профиля');
    }
});

//logout
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        } else {
            console.error(`${response.error}`);
        }
    });
};

//Курсы валют + таблица
function getCurrencyRate() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            rateBoard.clearTable();
            rateBoard.fillTable(response.data);
        } else {
            console.error('Ошибка получения курсов валют');
        }
    });
}

getCurrencyRate();

setInterval(getCurrencyRate(), 50000);

moneyManager.addMoneyCallback = ((data) => {
    ApiConnector.addMoney(data, (response) => {
        show(response, 'Деньги пришли');
    });
});

moneyManager.conversionMoneyCallback = ((data) => {
    ApiConnector.convertMoney(data, (response) => {
        show(response, 'Обмен произведён');
    });
});

moneyManager.sendMoneyCallback = ((data) => {
    ApiConnector.transferMoney(data, (response) => {
        show(response, 'Деньги переведены');
    });
});

//Избранное. Список.
ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = ((data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь был успешно добавлен');
        } else {
            favoritesWidget.setMessage(false, `Произошла ошибка ${response.error}`);
        }
    });
});

favoritesWidget.removeUserCallback = ((data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, 'Пользователь был успешно удалён');
        } else {
            favoritesWidget.setMessage(false, `Произошла ошибка ${response.error}`);
        }
    });
});
