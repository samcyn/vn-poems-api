import Api from '@/services/Api';

export default {
  getAll () {
    return Api().get('poems');
  },
  getOne (docId) {
    return Api().get(`poems/${docId}`);
  },
  post (credentials, token) {
    return Api().post('poems', credentials, {
      headers: { 'x-auth' : token }
    });
  }
}