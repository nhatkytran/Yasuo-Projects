import { CONTENT, LOADING, ERROR, TOAST_GALLERY } from '../config';
import { catchAsync } from '../utils';

import store from '../models/store';
import galleryService from '../models/features/gallery/galleryService';
import { ACTIONS } from '../models/features/gallery/reducer';

const filename = 'galleryController.js';

class GalleryController {
  #GalleryView;
  #ToastView;
  chooseGallery;

  constructor(GalleryView, ToastView, warningFramework) {
    this.#GalleryView = GalleryView;
    this.#ToastView = ToastView;

    this.chooseGallery = warningFramework({
      open: index =>
        window.open(store.state.gallery.gallery[index].link, '_blank'),
      accept: index => ({
        description: `You are being redirected to [<span style="user-select: all">${store.state.gallery.gallery[index].link}</span>]. This is a trusted URL, but not a part of 'Yasuo | The King of All Kings'`,
        buttonMessage: "I know, let's go",
      }),
    });
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      this.#GalleryView.displayContent(LOADING);

      await galleryService.getData('/api/v1/gallery/data');
      await this.#GalleryView.createGallery(store.state.gallery.gallery);

      store.dispatch(ACTIONS.setDataOk());
      this.#ToastView.createToast(store.state.toast[TOAST_GALLERY]);
      this.#GalleryView.displayContent(CONTENT);
    },
    onError: () => this.#GalleryView.displayContent(ERROR),
  });
}

export default GalleryController;
