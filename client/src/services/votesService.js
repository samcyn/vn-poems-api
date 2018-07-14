import Api from '@/services/Api';

export default {
  upVote (poemId, token) {
    return Api().put(`poems/${poemId}/upvote`, {}, {
      headers: { 'x-auth' : token }
    });
  },
  downVote (poemId, token) {
    return Api().put(`poems/${poemId}/downvote`, {}, {
      headers: { 'x-auth' : token }
    });
  }
}