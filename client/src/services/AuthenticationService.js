import Api from '@/services/Api';

export default {
  register (credentials) {
    return Api().post('users', credentials);
  },
  login (credentials) {
    return Api().post('users/login', credentials);
  },
  logOut () {
    return Api().delete('users/me/token');
  }
}