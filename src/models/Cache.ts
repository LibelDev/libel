import { IPost, IQuoteListResponseData, IReplyListResponseData } from '../types/post';
import { IThread, IThreadListResponseData } from '../types/thread';
import { IUser } from '../types/user';

type Threads = { [thread: string]: IThread | undefined; };
type Replies = { [post: string]: IPost | undefined; };
type Users = { [user: string]: IUser | undefined; };

class Cache {
  private threads: Threads = {};
  private replies: Replies = {};
  private users: Users = {};
  currentReply?: IPost;

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
      const { user_id: userID } = user;
      this.users[userID] = user;
    }
  }
}

export default Cache;
