import type { IPost, IQuoteListResponseData, IReplyListResponseData, IThread, IThreadListResponseData, IUser } from '../types/lihkg';

type TThreads = { [thread: string]: IThread | undefined; };
type TReplies = { [post: string]: IPost | undefined; };
type TUsers = { [user: string]: IUser | undefined; };

class Cache {
  private threads: TThreads = {};
  private replies: TReplies = {};
  private users: TUsers = {};

  getThread (id: string) {
    return this.threads[id];
  }

  getReply (id: string) {
    return this.replies[id];
  }

  getUser (id: string) {
    return this.users[id];
  }

  addThreads (data: IThreadListResponseData) {
    const { items } = data.response;
    for (const item of items) {
      const { thread_id: threadID } = item;
      this.threads[threadID] = item;
    }
  };

  addReplies (data: IReplyListResponseData | IQuoteListResponseData) {
    const { item_data: items } = data.response;
    for (const item of items) {
      const { post_id: postID } = item;
      this.replies[postID] = item;
    }
  }

  addUsers (data: IThreadListResponseData & IReplyListResponseData & IQuoteListResponseData) {
    const items = data.response.items || data.response.item_data;
    for (const item of items) {
      const { user } = item;
      const { user_id: userId } = user;
      this.users[userId] = user;
    }
  }
}

export default Cache;
