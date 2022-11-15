import type { APIv2, IPost, IThread, IUser } from '../types/lihkg';

type TThreads = { [thread: string]: IThread | undefined; };
type TReplies = { [post: string]: IPost | undefined; };
type TUsers = { [user: string]: IUser | undefined; };

class Cache {
  private currentThreadPoster?: IUser;
  private threads: TThreads = {};
  private replies: TReplies = {};
  private users: TUsers = {};

  getCurrentThreadPoster () {
    return this.currentThreadPoster;
  }

  getThread (id: string) {
    return this.threads[id];
  }

  getReply (id: string) {
    return this.replies[id];
  }

  getUser (id: string) {
    return this.users[id];
  }

  private addPost (post: IPost, overwrite = false) {
    const { post_id: postId, quote } = post;
    this.replies[postId] = overwrite ? post : (this.replies[postId] || post);
    if (quote) {
      this.addPost(quote, overwrite);
    }
  }

  private addUser (user: IUser) {
    const { user_id: userId } = user;
    this.users[userId] = user;
  }

  private setCurrentThreadPoster (user: IUser) {
    this.currentThreadPoster = user;
  }

  handleThreads (data: APIv2.IThreadListResponseBody) {
    const { items: threads } = data.response;
    for (const thread of threads) {
      const { thread_id: threadID } = thread;
      this.threads[threadID] = thread;
    }
  };

  handleReplies (data: APIv2.IReplyListResponseBody | APIv2.IQuoteListResponseBody) {
    const { item_data: posts } = data.response;
    for (const post of posts) {
      this.addPost(post);
    }
  }

  handleQuotedPost (data: APIv2.IQuotedPostResponseBody) {
    const { post } = data.response;
    this.addPost(post, true);
  }

  handleUsers (data: APIv2.IThreadListResponseBody | APIv2.IReplyListResponseBody | APIv2.IQuoteListResponseBody | APIv2.IQuotedPostResponseBody) {
    if ('user' in data.response) {
      const { user } = data.response;
      this.addUser(user);
      this.setCurrentThreadPoster(user);
    }
    if ('items' in data.response) {
      const { items: threads } = data.response;
      for (const thread of threads) {
        const { user } = thread;
        this.addUser(user);
      }
    }
    if ('item_data' in data.response) {
      const { item_data: posts } = data.response;
      for (const post of posts) {
        const { user } = post;
        this.addUser(user);
      }
    }
    if ('thread' in data.response) {
      const { thread } = data.response;
      const { user } = thread;
      this.addUser(user);
      this.setCurrentThreadPoster(user);
    }
  }
}

export default Cache;
