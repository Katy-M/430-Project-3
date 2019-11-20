const handleLogin = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val == '') {
        alert("Username or password is empty.");
        return false;
    }

    console.log($("input[name=_csrf]").val());
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    
    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val() == '') {
        alert("All fields are required.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    
    return false;
};

const handlePasswordChange = (e) => {
    e.preventDefault();

    if($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val() == '') {
        alert("All fields are required.");
        return false;
    }

    sendAjax('POST', $("#changePassword").attr("action"), $("#changePassword").serialize(), redirect);
    
    return false;
};

const LoginWindow = (props) => {
    return(
        <form id = "loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className="form-group container">
                <label htmlFor="username">Username: </label>
                <input id="user" className="form-control" type="text" name="username" placeholder="Username"/>
            </div>

            <div className="form-group container">
                <label htmlFor="pass">Password: </label>
                <input id="pass" className="form-control" type="password" name="pass" placeholder="Password"/>
            </div>

            <div className="form-group container">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit btn btn-primary" type="submit" value="Sign in"/>
            </div>
        </form>
    );
};

const SignupWindow = (props) => {
    return(
        <form id = "signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <div className="form-group container">
                <label htmlFor="username">Username: </label>
                <input id="user" className="form-control" type="text" name="username" placeholder="Username"/>
            </div>

            <div className="form-group container">
                <label htmlFor="pass">Password: </label>
                <input id="pass" className="form-control" type="password" name="pass" placeholder="Password"/>
            </div>

            <div className="form-group container">
                <input id="pass2" className="form-control" type="password" name="pass2" placeholder="Retype password"/>
            </div>

            <div className="form-group container">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit btn btn-primary" type="submit" value="Sign up"/>
            </div>
        </form>
    );
};

const ChangePasswordWindow = (props) => {
    return(
        <form id = "changePassword"
            name="changePassword"
            onSubmit={handlePasswordChange}
            action="/changePassword"
            method="POST"
            className="mainForm"
        >
            <div className="form-group container">
                <label htmlFor="username">Username: </label>
                <input id="user" className="form-control" type="text" name="username" placeholder="Username"/>
            </div>

            <div className="form-group container">
                <label htmlFor="pass">Password: </label>
                <input id="pass" className="form-control" type="password" name="pass" placeholder="Old password"/>
            </div>

            <div className="form-group container">
                <input id="pass2" className="form-control" type="password" name="pass2" placeholder="New password"/>
            </div>

            <div className="form-group container">
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit btn btn-primary" type="submit" value="Confirm"/>
            </div>
        </form>
    );
};

const Title = (props) => {
    return(
        <div>
            <h1 className="text-center">Welcome to Treasure Snatcher!</h1>
            <h2 className="text-center">{props.text}</h2>
        </div>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <div>
            <Title text = "Login" />
            <LoginWindow csrf={csrf} />
        </div>,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <div>
            <Title text = "Sign Up" />
            <SignupWindow csrf={csrf} />
        </div>,
        document.querySelector("#content")
    );
};

// Big dumb - make this require user to be logged in or add two-factor auth
const createChangePasswordWindow= (csrf) => {
    ReactDOM.render(
        <div>
            <Title text = "Change Password" />
            <ChangePasswordWindow csrf={csrf} />
        </div>,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const changePasswordButton = document.querySelector("#changePasswordButton")

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    changePasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});