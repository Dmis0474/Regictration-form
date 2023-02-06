
//API

class ApiClass {
  constructor() {
    this.url = "https://api.dating.com/identity";
  }
  async registration(email, password, method) {
    const result = await fetch(this.url, {
      method,
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
        
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return result;
  }
}

const Api = new ApiClass();

//CONTROLLER

class ControllerClass {
  constructor(elem) {
    this.element = elem || document.querySelector("#container");
  }
  init() {
    this.element.addEventListener("click", (e) => {
      const elem = e.target;
      if (elem.hasAttribute("data-button-signUp")) {
        ShowRegistrationForm();
      }
      if (elem.hasAttribute("data-form-button")) {
        if (elem.getAttribute("data-form-button") === "form-button-close") {
          closeForm();
        }
      }
    });
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      const elem = e.target;
      if (elem.getAttribute('id') === 'form') {
        sentRegistrationData(document.getElementById('input_email').value, document.getElementById('input_password').value)
        
      }
    })

    this.element.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) {
        closeForm();
      }
    });

    this.element.addEventListener("input", (e) =>{
      const elem = e.target;
      if(elem.hasAttribute("data-form-input")){
        const attr = elem.getAttribute("data-form-input");
        if (attr === "form-input-email"){
          checkEmail(elem.value);
        }
        if (attr === "form-input-password") {
          checkPassword(elem.value)
        }
      }
    })
  }
}

const Controller = new ControllerClass(document.body);


function sentRegistrationData(email, password){
  if(email && password){
    Api.registration(email, password, 'PUT').then( res => {
      console.log('res', res)
        if(res?.ok){
            showThankYou();
            return res.json()
        }
    }).then(data => {
      console.log('data', data);
    })
  }  
}

function checkEmail (email) {
  const emailStatusOk ="E-mail is valid"
  const emailStatusError ="Please enter a valid e-mail"
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if(re.test(String(email).toLowerCase())){
    showFieldStatus("ok", emailStatusOk, "#input-wrapper-email")
  } else {
    showFieldStatus("error", emailStatusError, "#input-wrapper-email")
  }
}

function checkPassword (password) {
  const passwordStatusOk ="Password is valid"
  const passwordStatusError ="Please enter a valid password"
  if(password.length >= 8) {
    showFieldStatus("ok", passwordStatusOk, "#input-wrapper-password")
  } else {
    showFieldStatus("error", passwordStatusError, "#input-wrapper-password")
  }
}

//VIEW
function ShowRegistrationForm() {
  const container = document.querySelector("#container");
  const div = document.createElement('div');
  div.classList.add('form-container');
  div.setAttribute('id', 'form-container');
  div.innerHTML = `
  <form class="form" id="form" action="/">
    <div class="form__wrapper" id="form-wrapper">
        <h5 class="form__header">To register, enter the mail to which our news is sent and set your password</h5>
        <div class="input__wrapper input__wrapper--email" id="input-wrapper-email">
          <input type="email" id="input_email" class="form__input form__input--email" placeholder="Example@email.com" data-form-input="form-input-email" required />
        </div>
        <div class="input__wrapper input__wrapper--password" id="input-wrapper-password" >
          <input type="password" id="input_password" class="form__input form__input--password" placeholder="Password" data-form-input="form-input-password" required minlength="7" />
        </div>
        <button class="menu__button form__button" data-form-button="form-button-submit">SUBMIT</button>
    </div>
    <a class="form__escape" href="#"  >
    <img class="form__escape-image" src="public/form/close-form.svg" data-form-button="form-button-close"/>
    </a>
  </form>
  `;

  container.appendChild(div);
}

function showThankYou() {
  let formContainer = document.querySelector("#form");
  formContainer.innerHTML = `
  <div class="result__wrapper">
    <h1 class="result__header menu__header">Thank You</h1>
    <h5 class="result__description">To complete registration, please check your e-mail</h5>
  </div>
  <a class="form__escape" href="#"  >
    <img class="form__escape-image" src="public/form/close-form.svg" data-form-button="form-button-close"/>
    </a>
  `
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function closeForm() {
  document.querySelector("#form-container").remove();
}

function showFieldStatus(status, message, selector){
  const emailField = document.querySelector(selector)
  if(status ==="ok"){
    emailField.firstElementChild.classList.remove("form__error")
    emailField.querySelector('.email-error')?.remove();
  }
  if(status ==="error"){
    emailField.firstElementChild.classList.add("form__error")
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('email-error');
    errorDiv.innerHTML = message;
    emailField.querySelector('.email-error') ? null : emailField.appendChild(errorDiv);
  }
}


Controller.init();
