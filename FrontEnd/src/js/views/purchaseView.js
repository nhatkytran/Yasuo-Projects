import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  ANIMATION_TIMEOUT_500,
  START,
  END,
  ADD,
  REMOVE,
  LOADING,
  OPEN_PURCHASE_EVENT,
} from '../config';

import {
  $,
  $_,
  $$,
  $$_,
  animateFactory,
  classRemove,
  countYear,
  mapMarkup,
} from '../utils';

class PurchaseView {
  #mainButton = $_($('.trailer__content'), 'button');
  #mainButtonLoader = $_(this.#mainButton, 'svg');

  #pur = $('.pur');
  #purButtonBack = $('.pur-header__back');

  #backgroundImageWrapper = $('.pur-intro__background');
  #mainImageWrapper = $('.pur-intro__content-image-wrapper');

  #skinName = $_($('.pur-intro__content-text'), 'h2');
  #skinYear = $('.pur-intro__content-footer-time');
  #skinCollection = [
    ...$$_($('.pur-intro__content-footer-info-collection'), 'span'),
  ].at(-1);
  #skinDetaislWrapper = $('.pur-article__text');
  #skinTagsWrapper = $('.pur-article__tag-wrapper');
  #skinVideoWrapper = $('.pur-article__video-wrapper');
  #skinPrice = $_($('.pur-article__buy-header'), 'label');
  #skinRelatesWrapper = $_($('.pur-relate__skins'), 'ul');

  #animatePur;

  constructor() {
    this.#animatePur = animateFactory(this.#pur, {
      start: 'fade-in-500',
      end: 'fade-out-480',
    });
  }

  #handleContent = (skinData, skinRelatesData) => {
    const {
      name,
      releaseYear,
      inCollection,
      price,
      details,
      tags,
      image,
      youtubeLink,
    } = skinData;

    const imageTag = `<img src="${BACKEND_URL}${image}" draggable="false" alt="${releaseYear} - ${inCollection} - ${name}">`;
    this.#backgroundImageWrapper.innerHTML = imageTag;
    this.#mainImageWrapper.innerHTML = imageTag;

    this.#skinName.innerHTML = name;
    this.#skinYear.innerHTML = countYear(releaseYear);
    this.#skinCollection.innerHTML = inCollection;

    this.#skinDetaislWrapper.innerHTML = mapMarkup(
      details,
      detail => `<p>${detail}</p>`
    );
    this.#skinTagsWrapper.innerHTML = mapMarkup(
      tags,
      tag => `<button class="button">${tag}</button>`
    );

    this.#skinVideoWrapper.innerHTML = `<iframe src="${youtubeLink}&hl=en" frameborder="0"></iframe>`;
    this.#skinPrice.innerHTML = `Price: ${price} RP`;

    this.#skinRelatesWrapper.innerHTML = mapMarkup(skinRelatesData, skin => {
      const alt = `${skin.releaseYear} - ${skin.inCollection} - ${skin.name}`;
      const detail = `${skin.details[0].slice(0, 85)}${
        skin.details[0].length <= 85 ? '' : '...'
      }`;
      return `
        <li class="pur-relate__skins-item">
          <a class="pur-relate__skins-link" data-true-index="${
            skin.trueIndex
          }" href="">
            <img src="${BACKEND_URL}${skin.image}" alt="${alt}">
            <div class="pur-relate__skins-text">
              <span>Related Skin</span>
              <h3>${skin.name}</h3>
              <p>${detail}</p>
              <label>mon cat - ${countYear(skin.releaseYear)}</label>
            </div>
          </a>
        </li>
      `;
    });
  };

  scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  open = (skinData, skinRelatesData) => {
    classRemove(REMOVE, this.#pur);
    this.#animatePur(START);
    this.#handleContent(skinData, skinRelatesData);
  };

  close = () => {
    this.#animatePur(END);
    setTimeout(classRemove.bind(null, ADD, this.#pur), ANIMATION_TIMEOUT * 2);
  };

  openPurchaseViewSignal = index =>
    this.#pur.dispatchEvent(
      new CustomEvent(OPEN_PURCHASE_EVENT, { detail: index })
    );

  displayContent(state) {
    classRemove(state === LOADING ? REMOVE : ADD, this.#mainButtonLoader);
    this.#mainButton.style.cursor =
      state === LOADING ? 'not-allowed' : 'pointer';
  }

  //
  // Events listening //////////

  addFetchDataHandler(handler) {
    this.#mainButton.addEventListener('click', () => {
      if (!this.#mainButtonLoader.classList.contains('remove')) return;
      handler();
    });
  }

  addOpenPurchaseViewHandler(handler) {
    this.#pur.addEventListener(OPEN_PURCHASE_EVENT, event =>
      handler(event.detail)
    );
  }

  addClosePurchaseViewHandler(handler) {
    this.#purButtonBack.addEventListener('click', handler);
  }

  addSkinRealatesHandler(handler) {
    this.#skinRelatesWrapper.addEventListener('click', event => {
      event.preventDefault();
      const target = event.target.closest('.pur-relate__skins-link');
      if (!target) return;
      this.close();
      setTimeout(
        () => handler(Number.parseInt(target.dataset.trueIndex)),
        ANIMATION_TIMEOUT
      );
    });
  }
}

export default new PurchaseView();
