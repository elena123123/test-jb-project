import axios, {AxiosResponse} from 'axios';

export const requestMenuItems = (options:object) => {
  return axios.get('/json', options)
    .then((res:AxiosResponse) => res.data);
};