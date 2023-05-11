export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const $_ = (node, selector) => node.querySelector(selector);
export const $$_ = (node, selector) => node.querySelectorAll(selector);

export const catchAsync =
  fn =>
  async (...rest) => {
    try {
      return await fn(...rest);
    } catch (error) {
      throw error;
    }
  };
