import { create } from 'zustand';
import type { User, Post, Notification, Chat, Message } from '@/types';
import { MOCK_NOTIFICATIONS, MOCK_CHATS, MOCK_MESSAGES } from '@/lib/mockData';
import { onAuthChange, logOut } from '@/lib/authService';

// ── Auth Store ───────────────────────────────────────
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initAuth: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: (user) => set({ user, isAuthenticated: true, loading: false }),
  logout: async () => {
    await logOut();
    set({ user: null, isAuthenticated: false });
  },
  initAuth: () => {
    const unsub = onAuthChange((user) => {
      set({ user, isAuthenticated: !!user, loading: false });
    });
    return unsub;
  },
}));

// ── Post Store ───────────────────────────────────────
interface PostStore {
  posts: Post[];
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addPost: (post: Post) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,
  setPosts: (posts) => set({ posts, loading: false }),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      ),
    })),
  toggleSave: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, isSaved: !p.isSaved, savesCount: p.isSaved ? p.savesCount - 1 : p.savesCount + 1 }
          : p
      ),
    })),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));

// ── Notification Store ───────────────────────────────
interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}));

// ── Chat Store ───────────────────────────────────────
interface ChatStore {
  chats: Chat[];
  activeChat: string | null;
  messages: Record<string, Message[]>;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, sender: User) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: MOCK_CHATS,
  activeChat: null,
  messages: { chat1: MOCK_MESSAGES },
  setActiveChat: (chatId) => set({ activeChat: chatId }),
  sendMessage: (chatId, content, sender) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: sender.id,
      sender,
      content,
      read: false,
      createdAt: new Date(),
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] ?? []), newMessage],
      },
      chats: state.chats.map((c) =>
        c.id === chatId ? { ...c, lastMessage: newMessage, updatedAt: new Date() } : c
      ),
    }));
  },
}));

// ── UI Store ─────────────────────────────────────────
interface UIStore {
  uploadModalOpen: boolean;
  mobileMenuOpen: boolean;
  setUploadModal: (open: boolean) => void;
  setMobileMenu: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  uploadModalOpen: false,
  mobileMenuOpen: false,
  setUploadModal: (open) => set({ uploadModalOpen: open }),
  setMobileMenu: (open) => set({ mobileMenuOpen: open }),
}));
