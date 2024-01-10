import {
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  START,
  END,
  FADE_IN,
  LOGIN_SUCCESS_SIGNAL,
} from '../config';

import { $, $_, $$_, animateFactory, classRemove } from '../utils';

const loginWarningMessageClass = '.login-form__header-warning-message';
const disabledCssText = `opacity: 0.6; cursor: not-allowed;`;
const activateWarningMessageClass = '.activate-form__header-warning-message';

class AuthView {
  #loginSection = $('.login-overlay');
  #loginForm = $('#login-form');
  #loginOpenButtonSubHeader = $('.sub-header__content-login');
  #loginOpenButtonMainHeader = $('.main-header__play-sign-in');
  #loginUserName = $('.user__info-name');
  #loginExitButton = $('.login-form__header-hero-close');
  #loginWarningButton = $('.login-form__header-warning-button');
  #loginWarningMessageUsername = $(`${loginWarningMessageClass}-username`);
  #loginWarningMessagePassword = $(`${loginWarningMessageClass}-password`);
  #loginWarningMessageFail = $(`${loginWarningMessageClass}-fail`);
  #loginUsernameInput = $('#login-form-username');
  #loginPasswordInput = $('#login-form-password');
  #loginPasswordTypeButton = $('.login-form-password__type-button');
  #loginButton = $('.login-form__body-button');
  #loginButtonSocialWrapper = $('.login-form__options');
  #loginActivateButton = $('.login-form__privacy-activate-button');

  //
  #logoutButtonSubHeader = $('.sub-header__content-logout');
  #userAvatarWrapper = $('.yasuo-round');
  #userAvatarSrc;

  //
  #activateSection = $('.activate-overlay');
  #activateForm = $('#activate-form');
  #activateExitButton = $('.activate-form__header-hero-close');
  #activateHeaderTitle = $('.activate-form__header-title');
  #activateWarningButton = $('.activate-form__header-warning-button');
  #activateWarningMessageEmail = $(`${activateWarningMessageClass}-email`);
  #activateWarningMessageCode = $(`${activateWarningMessageClass}-code`);
  #activateWarningMessageFail = $(`${activateWarningMessageClass}-fail`);
  #activateEmailInput = $('#activate-form-email');
  #activateCodeInput = $('#activate-form-code');
  #activateButton = $('.activate-form__body-button');
  #activateActionsWrapper = $('.activate-form__actions-wrapper');
  #activateActionsBackWrapper = $('.activate-form__actions-back-wrapper');
  #activateActionsBackButton = $('.activate-form__actions-back-button');

  //
  #animateLoginSection;
  #animateActivateSection;

  constructor() {
    this.#userAvatarSrc = $_(this.#userAvatarWrapper, 'img').src;

    const animateOption = { start: FADE_IN, end: 'fade-out-480' };

    this.#animateLoginSection = animateFactory(
      this.#loginSection,
      animateOption
    );
    this.#animateActivateSection = animateFactory(
      this.#activateSection,
      animateOption
    );
  }

  loginOpen = () => {
    classRemove(REMOVE, this.#loginSection);
    this.#animateLoginSection(START);
  };

  loginClose = () => {
    classRemove(ADD, this.#loginSection);
    this.#animateLoginSection(END);
  };

  loginSuccess = () => {
    classRemove(
      ADD,
      this.#loginOpenButtonSubHeader,
      this.#loginOpenButtonMainHeader
    );
    classRemove(REMOVE, this.#loginUserName, this.#logoutButtonSubHeader);
  };

  loginSuccessSignal = () =>
    this.#loginUserName.dispatchEvent(new CustomEvent(LOGIN_SUCCESS_SIGNAL));

  loginWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#loginWarningMessageFail);

    if (isError) {
      if (field === 'username')
        this.#loginWarningMessageUsername.textContent =
          'Username must be 5+ characters.';

      if (field === 'password')
        this.#loginWarningMessagePassword.textContent =
          'Password: 8+ chars (uppercase, lowercase, number, symbol).';

      return classRemove(ADD, this.#loginWarningButton);
    }

    if (field === 'username')
      this.#loginWarningMessageUsername.textContent = '';
    if (field === 'password')
      this.#loginWarningMessagePassword.textContent = '';

    if (
      this.#loginWarningMessageUsername.textContent === '' &&
      this.#loginWarningMessagePassword.textContent === ''
    )
      classRemove(REMOVE, this.#loginWarningButton);
  };

  loginButtonDisplay = ({ canLogin }) => {
    if (!canLogin) this.#loginButton.style.cssText = disabledCssText;
    else this.#loginButton.style.cssText = `opacity: 1; cursor: pointer;`;
  };

  loginPasswordTypeDisplay = () => {
    $$_(this.#loginPasswordTypeButton, 'svg').forEach((svg, index) => {
      svg.classList.toggle('remove');
      if (!svg.classList.contains('remove'))
        this.#loginPasswordInput.setAttribute(
          'type',
          index === 0 ? 'password' : 'text'
        );
    });
  };

  loginActionDisplay = ({ state, errorMessage }) => {
    if (state === LOADING) {
      this.#loginUsernameInput.disabled = true;
      this.#loginPasswordInput.disabled = true;
      this.#loginUsernameInput.style.cssText = disabledCssText;
      this.#loginPasswordInput.style.cssText = disabledCssText;

      $$_(this.#loginButton, 'svg').forEach((svg, index) =>
        classRemove(index === 0 ? ADD : REMOVE, svg)
      );
      return (this.#loginButton.style.cssText = disabledCssText);
    }

    this.#loginUsernameInput.disabled = false;
    this.#loginPasswordInput.disabled = false;
    this.#loginUsernameInput.style.cssText = `opacity: 1; cursor: text;`;
    this.#loginPasswordInput.style.cssText = `opacity: 1; cursor: text;`;

    $$_(this.#loginButton, 'svg').forEach((svg, index) =>
      classRemove(index === 1 ? ADD : REMOVE, svg)
    );

    if (state === ERROR) {
      classRemove(ADD, this.#loginWarningButton);
      this.#loginWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#loginWarningMessageFail);
      this.#loginButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      this.#loginUsernameInput.value = '';
      this.#loginPasswordInput.value = '';
    }
  };

  //

  logoutActionDisplay = state => {
    if (state === LOADING) {
      document.documentElement.style.cursor = 'wait';
      document.body.style.cssText = `
        pointer-events: none;
        filter: brightness(0.4);
        opacity: 0.8;
      `;
    }
    if (state === CONTENT || state === ERROR) {
      document.documentElement.style.cursor = 'default';
      document.body.style.cssText = `
        pointer-events: unset;
        filter: unset;
        opacity: unset;
      `;
    }
  };

  logoutSuccess = () => {
    classRemove(
      REMOVE,
      this.#loginOpenButtonSubHeader,
      this.#loginOpenButtonMainHeader
    );
    classRemove(ADD, this.#loginUserName, this.#logoutButtonSubHeader);

    const image = document.createElement('img');
    image.src = this.#userAvatarSrc;

    image.addEventListener('load', () => {
      this.#userAvatarWrapper.innerHTML = '';
      this.#userAvatarWrapper.appendChild(image);
    });
  };

  //
  activateOpen = () => {
    classRemove(REMOVE, this.#activateSection);
    this.#animateActivateSection(START);
  };

  activateClose = () => {
    classRemove(ADD, this.#activateSection);
    this.#animateActivateSection(END);
  };

  activateWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#activateWarningMessageFail);

    if (isError) {
      if (field === 'email')
        this.#activateWarningMessageEmail.textContent =
          'Please provide a valid email.';

      if (field === 'code')
        this.#activateWarningMessageCode.textContent =
          'Please provide a valid code';

      return classRemove(ADD, this.#activateWarningButton);
    }

    if (field === 'email') this.#activateWarningMessageEmail.textContent = '';
    if (field === 'code') this.#activateWarningMessageCode.textContent = '';
    classRemove(REMOVE, this.#activateWarningButton);
  };

  activateButtonDisplay = ({ canLogin }) => {
    if (!canLogin) this.#activateButton.style.cssText = disabledCssText;
    else this.#activateButton.style.cssText = `opacity: 1; cursor: pointer;`;
  };

  activateActionDisplay = ({ state, errorMessage }) => {
    if (state === LOADING) {
      this.#activateEmailInput.disabled = true;
      this.#activateCodeInput.disabled = true;
      this.#activateEmailInput.style.cssText = disabledCssText;
      this.#activateCodeInput.style.cssText = disabledCssText;

      $$_(this.#activateButton, 'svg').forEach((svg, index) =>
        classRemove(index === 0 ? ADD : REMOVE, svg)
      );
      return (this.#activateButton.style.cssText = disabledCssText);
    }

    this.#activateEmailInput.disabled = false;
    this.#activateCodeInput.disabled = false;
    this.#activateEmailInput.style.cssText = `opacity: 1; cursor: text;`;
    this.#activateCodeInput.style.cssText = `opacity: 1; cursor: text;`;

    $$_(this.#activateButton, 'svg').forEach((svg, index) =>
      classRemove(index === 1 ? ADD : REMOVE, svg)
    );

    if (state === ERROR) {
      classRemove(ADD, this.#activateWarningButton);
      this.#activateWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#activateWarningMessageFail);
      this.#activateButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      this.#activateEmailInput.value = '';
      this.#activateCodeInput.value = '';
    }
  };

  activateGetCodeSuccess = (option = {}) => {
    const { goBack } = option;

    this.#activateHeaderTitle.textContent = goBack ? 'Activate' : 'Code';
    classRemove(
      goBack ? REMOVE : ADD,
      this.#activateEmailInput.parentElement,
      this.#activateActionsWrapper
    );
    classRemove(
      goBack ? ADD : REMOVE,
      this.#activateCodeInput.parentElement,
      this.#activateActionsBackWrapper
    );
  };

  //
  // Events listening //////////

  // Sign-in //////////

  addLoginCheckFirst(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  addLoginOpenHandler(handler) {
    [this.#loginOpenButtonSubHeader, this.#loginOpenButtonMainHeader].forEach(
      button => button.addEventListener('click', handler)
    );
  }

  addLoginCloseHandler(handler) {
    [
      this.#loginExitButton,
      this.#loginSection,
      this.#loginActivateButton,
    ].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );

    this.#loginForm.addEventListener('click', event => event.stopPropagation());
  }

  addLoginWarningHanler(handler) {
    this.#loginWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginInputHandlers(handlers) {
    // handlers -> [[], []]
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [this.#loginUsernameInput, this.#loginPasswordInput].forEach(
        (input, index) =>
          input.addEventListener(eventName, event =>
            handlers[eventIndex][index](event.target.value)
          )
      )
    );
  }

  addLoginPasswordTypeHandler(handler) {
    this.#loginPasswordTypeButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginHandler(handler) {
    this.#loginButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginSocialHandler(handler) {
    this.#loginButtonSocialWrapper.addEventListener('click', event => {
      const target = event.target.closest('.login-form__options-button');
      if (target) {
        event.preventDefault();
        handler(target.dataset.loginSocial);
      }
    });
  }

  addLoginChooseActivateHandler(handler) {
    this.#loginActivateButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  // Sign-out //////////

  addLogoutHandler(handler) {
    this.#logoutButtonSubHeader.addEventListener('click', handler);
  }

  // Activate //////////

  addActivateCloseHandler(handler) {
    [this.#activateExitButton, this.#activateSection].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );
    this.#activateForm.addEventListener('click', event =>
      event.stopPropagation()
    );
  }

  addActivateWarningHanler(handler) {
    this.#activateWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addActivateInputHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [this.#activateEmailInput, this.#activateCodeInput].forEach(
        (input, index) =>
          input.addEventListener(eventName, event =>
            handlers[eventIndex][index](event.target.value)
          )
      )
    );
  }

  addActivateHandler(handler) {
    this.#activateButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addActivateActionsBackHandler(handler) {
    this.#activateActionsBackButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }
}

export default new AuthView();
