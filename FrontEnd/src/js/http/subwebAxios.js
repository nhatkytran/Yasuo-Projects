import axiosInstance from './axios';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getTrailerVideo = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
};

const getTrailerVideoAbort = () => {
  if (abortController) abortController.abort();
};

const subwebAxios = { getTrailerVideo, getTrailerVideoAbort };

export default subwebAxios;
