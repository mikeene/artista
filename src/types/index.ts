// ── User Types ──────────────────────────────────────
export type UserRole = 'artist' | 'enthusiast' | 'brand';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: UserRole;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  worksCount: number;
  createdAt: Date;
  artInterests?: string[];
  website?: string;
  instagram?: string;
  twitter?: string;
}

// ── Post / Artwork Types ─────────────────────────────
export type ArtMedium =
  | 'Painting'
  | 'Photography'
  | 'Digital Art'
  | 'Sculpture'
  | 'Illustration'
  | 'Mixed Media'
  | 'Textile'
  | 'Printmaking'
  | 'Ceramics'
  | 'Street Art'
  | 'Installation'
  | 'Video Art'
  | 'Performance'
  | 'Other';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  medium: ArtMedium;
  tags: string[];
  dimensions?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: Date;
  updatedAt: Date;
  forSale: boolean;
  price?: number;
}

// ── Comment Types ────────────────────────────────────
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: Date;
  replies?: Comment[];
}

// ── Notification Types ───────────────────────────────
export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUser: User;
  toUserId: string;
  postId?: string;
  post?: Pick<Post, 'id' | 'title' | 'imageUrl'>;
  message?: string;
  read: boolean;
  createdAt: Date;
}

// ── Message / Chat Types ─────────────────────────────
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender: User;
  content: string;
  imageUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

// ── Explore / Search ─────────────────────────────────
export type ExploreTab = 'trending' | 'recent' | 'artists';
export type FeedTab = 'following' | 'discover';

export interface SearchResult {
  posts: Post[];
  artists: User[];
  tags: string[];
}

// ── Upload Form ──────────────────────────────────────
export interface UploadForm {
  title: string;
  description: string;
  medium: ArtMedium;
  tags: string[];
  dimensions: string;
  file: File | null;
}

// ── Auth ─────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

// ── Admin ────────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalArtists: number;
  totalReports: number;
  newUsersToday: number;
  newPostsToday: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  targetType: 'post' | 'user';
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}

// ── Art gradient palette ─────────────────────────────
export type ArtGradient =
  | 'art-terracotta'
  | 'art-ocean'
  | 'art-violet'
  | 'art-earth'
  | 'art-sage'
  | 'art-rose'
  | 'art-indigo'
  | 'art-amber';

export const ART_GRADIENTS: ArtGradient[] = [
  'art-terracotta', 'art-ocean', 'art-violet', 'art-earth',
  'art-sage', 'art-rose', 'art-indigo', 'art-amber',
];
