import Api from '@/services/Api';

export default {
  post (credentials, token ) {
    return Api().post('poems/comments', credentials, {
      headers: { 'x-auth' : token}
    });
  }
  
}