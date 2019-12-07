"use strict";

var handleLogin = function handleLogin(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val == '') {
        alert("Username or password is empty.");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

var handleSignup = function handleSignup(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val() == '') {
        alert("All fields are required.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val() == '') {
        alert("All fields are required.");
        return false;
    }

    sendAjax('POST', $("#changePassword").attr("action"), $("#changePassword").serialize(), redirect);
    return false;
};

var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "form",
        { id: "loginForm",
            name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "Username" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "pass", placeholder: "Password" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit btn btn-primary", type: "submit", value: "Sign in" })
        )
    );
};

var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "Username" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "pass", placeholder: "Password" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement("input", { id: "pass2", className: "form-control", type: "password", name: "pass2", placeholder: "Retype password" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit btn btn-primary", type: "submit", value: "Sign up" })
        )
    );
};

var ChangePasswordWindow = function ChangePasswordWindow(props) {
    return React.createElement(
        "form",
        { id: "changePassword",
            name: "changePassword",
            onSubmit: handlePasswordChange,
            action: "/changePassword",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "username" },
                "Username: "
            ),
            React.createElement("input", { id: "user", className: "form-control", type: "text", name: "username", placeholder: "Username" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement(
                "label",
                { htmlFor: "pass" },
                "Password: "
            ),
            React.createElement("input", { id: "pass", className: "form-control", type: "password", name: "pass", placeholder: "Old password" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement("input", { id: "pass2", className: "form-control", type: "password", name: "pass2", placeholder: "New password" })
        ),
        React.createElement(
            "div",
            { className: "form-group container" },
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit btn btn-primary", type: "submit", value: "Confirm" })
        )
    );
};

var Title = function Title(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h1",
            { className: "text-center" },
            "Welcome to Treasure Snatcher!"
        ),
        React.createElement(
            "h2",
            { className: "text-center" },
            props.text
        )
    );
};

var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(Title, { text: "Login" }),
        React.createElement(LoginWindow, { csrf: csrf })
    ), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(Title, { text: "Sign Up" }),
        React.createElement(SignupWindow, { csrf: csrf })
    ), document.querySelector("#content"));
};

// Big dumb - make this require user to be logged in or add two-factor auth
var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(Title, { text: "Change Password" }),
        React.createElement(ChangePasswordWindow, { csrf: csrf })
    ), document.querySelector("#content"));
};

var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");
    var changePasswordButton = document.querySelector("#changePasswordButton");

    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changePasswordButton.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr) {
            var messageObj = JSON.parse(xhr.responseText);
            alert(messageObj.error);
        }
    });
};

var getRandomInt = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
};

var getNumTreasures = function getNumTreasures() {
    var num = getRandomInt(3);
    if (num === 0) num = 1;
    return num;
};

var getRandomTreasure = function getRandomTreasure() {
    // 4 types of treasure
    var id = getRandomInt(5);
    var treasure = '';
    switch (id) {
        case 0:
            treasure = { name: 'Silver Platter', value: '500' };
            break;
        case 1:
            treasure = { name: 'Gold Coins', value: '50' };
            break;
        case 2:
            treasure = { name: 'Eye of Newt', value: '200' };
            break;
        case 3:
            treasure = { name: 'Serpent Tail', value: '830' };
            break;
        case 4:
            treasure = { name: 'Iron Sword', value: '25' };
            break;
        default:
            treasure = { name: 'undefined', value: '0' };
    }
    return treasure;
};
