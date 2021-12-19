"use strict";
let userForm = new UserForm();

userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response)=>{
        if (response.success) {
            location.reload();
        }
        else {
            userForm.setLoginErrorMessage(`Произошла ошибка: ${response.error}`);
        }
    });
};

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
       if (response.success === true) {
           location.reload();
       }
       else {
           userForm.setRegisterErrorMessage(`Произошла ошибка регистрации пользователя ${data.login}: ${response.error}`);
       }
    });
}