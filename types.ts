export interface Bid {
  id: string;
  actual_bid: number;
  auctionId: string;
  buyerId: string | null;
}

export interface Auction {
  id: string;
  product: string;
  userId: string;
  description: string;
  image: string;
  finished: boolean;
  category: string;
  finishTime: string;
  watchlistId: null;
  bid: Bid;
  Comment: Comm[];
}

export interface Comm {
  id: string;
  comment: string;
  answer: string | undefined;
  productId: string;
  userId: string;
}

export type newQuestionType = {
  id: string;
  userId: string;
  comment: string;
  productId: string;
  answer: string | undefined;
};

export type User = {
  id: string;
  email: string;
  name: string;
  image: string;
};

export interface Notification {
  id: string;
  notification: string;
  productName: string;
  checked: boolean;
  userId: string;
  auctionId: string;
}
