import axios from 'axios';

export const uploadFile = (binary, extension) => {
  return axios.post('https://www.transfer-uploader.tk', {
    binary,
    extension,
  });
};
