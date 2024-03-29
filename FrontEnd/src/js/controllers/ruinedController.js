import { CONTENT, LOADING, ERROR, TOAST_RUINED } from '../config';
import { catchAsync } from '../utils';

import store from '../models/store';
import ruinedService from '../models/features/ruined/ruinedService';
import { ACTIONS } from '../models/features/ruined/reducer';

const filename = 'ruinedController.js';

class RuinedController {
  #RuinedView;
  #ToastView;
  explore;

  constructor(RuinedView, ToastView, warningFramework) {
    this.#RuinedView = RuinedView;
    this.#ToastView = ToastView;

    const URL = 'https://www.ruinedking.com/en-us/';
    this.explore = warningFramework({
      open: () => window.open(URL, '_blank'),
      accept: () => ({
        description: `You are being redirected to [<span style="user-select: all">${URL}</span>]. This is a trusted URL, but not a part of 'Yasuo | The King of All Kings'`,
        buttonMessage: "I know, let's go",
      }),
    });
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      this.#RuinedView.displayContent(LOADING);

      await ruinedService.getData('/api/v1/ruined/data');
      await this.#RuinedView.createImages(store.state.ruined.images);

      store.dispatch(ACTIONS.setDataOk());
      this.#ToastView.createToast(store.state.toast[TOAST_RUINED]);
      this.#RuinedView.displayContent(CONTENT);
    },
    onError: () => {
      this.#RuinedView.displayContent(ERROR);
    },
  });
}

export default RuinedController;
