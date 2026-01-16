export interface User {
  clerkId: string;
  photo: string | null;
  username: string | null;
  nickname: string | null;
  email: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: number;
  post: string;
  photo: string | null;
  created_at: Date;
  updated_at: Date;
  userId: string;
}

export interface Comment {
  id: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
  userId: string;
  postId: number;
}

export interface Like {
  id: number;
  userId: string;
  postId: number;
  created_at: Date;
}

export interface Stars {
  id: number;
  userId: string;
  placeId: string;
  title: string;
  desc: string | null;
  icon: string | null;
  time: string | null;
  price: string | null;
  address: string | null;
  created_at: Date;
}

export interface Course {
  id: string;
  userId: string;
  title: string;
  vibe: string | null;
  route: string | null;
  totalDuration: string | null;
  spots: any;
  created_at: Date;
}
