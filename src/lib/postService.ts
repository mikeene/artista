import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, orderBy, limit, where, onSnapshot,
  serverTimestamp, increment, setDoc, deleteDoc,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Post, Comment, ArtMedium } from '@/types';

// ── Helpers ──────────────────────────────────────────
function toPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    ...data,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  } as Post;
}

// ── Create Post ──────────────────────────────────────
export async function createPost(
  authorId: string,
  data: {
    title: string;
    description: string;
    medium: ArtMedium;
    tags: string[];
    dimensions: string;
    imageUrl: string;
    thumbnailUrl: string;
  }
): Promise<string> {
  const ref = await addDoc(collection(db, 'posts'), {
    ...data,
    authorId,
    likesCount: 0,
    commentsCount: 0,
    savesCount: 0,
    sharesCount: 0,
    forSale: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update author's worksCount
  await updateDoc(doc(db, 'users', authorId), { worksCount: increment(1) });

  return ref.id;
}

// ── Get Feed Posts ───────────────────────────────────
export async function getFeedPosts(limitCount = 20): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);

  // Fetch authors in parallel
  const posts = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      const authorSnap = await getDoc(doc(db, 'users', data.authorId));
      return toPost(d.id, {
        ...data,
        author: authorSnap.exists() ? { id: authorSnap.id, ...authorSnap.data() } : null,
      });
    })
  );

  return posts;
}

// ── Get Posts by User ────────────────────────────────
export async function getUserPosts(userId: string): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const authorSnap = await getDoc(doc(db, 'users', userId));
  const author = authorSnap.exists() ? { id: authorSnap.id, ...authorSnap.data() } : null;

  return snap.docs.map(d => toPost(d.id, { ...d.data(), author }));
}

// ── Like / Unlike ────────────────────────────────────
export async function toggleLike(postId: string, userId: string, liked: boolean): Promise<void> {
  const interactionRef = doc(db, 'interactions', `${userId}_${postId}`);
  const postRef = doc(db, 'posts', postId);

  if (liked) {
    await deleteDoc(interactionRef);
    await updateDoc(postRef, { likesCount: increment(-1) });
  } else {
    await setDoc(interactionRef, { userId, postId, type: 'like', createdAt: serverTimestamp() });
    await updateDoc(postRef, { likesCount: increment(1) });
  }
}

// ── Save / Unsave ────────────────────────────────────
export async function toggleSave(postId: string, userId: string, saved: boolean): Promise<void> {
  const saveRef = doc(db, 'saves', `${userId}_${postId}`);
  const postRef = doc(db, 'posts', postId);

  if (saved) {
    await deleteDoc(saveRef);
    await updateDoc(postRef, { savesCount: increment(-1) });
  } else {
    await setDoc(saveRef, { userId, postId, createdAt: serverTimestamp() });
    await updateDoc(postRef, { savesCount: increment(1) });
  }
}

// ── Check interactions for current user ─────────────
export async function getUserInteractions(
  userId: string,
  postIds: string[]
): Promise<{ liked: Set<string>; saved: Set<string> }> {
  const liked = new Set<string>();
  const saved = new Set<string>();

  await Promise.all(
    postIds.map(async (postId) => {
      const [likeSnap, saveSnap] = await Promise.all([
        getDoc(doc(db, 'interactions', `${userId}_${postId}`)),
        getDoc(doc(db, 'saves', `${userId}_${postId}`)),
      ]);
      if (likeSnap.exists()) liked.add(postId);
      if (saveSnap.exists()) saved.add(postId);
    })
  );

  return { liked, saved };
}

// ── Comments ─────────────────────────────────────────
export async function addComment(
  postId: string,
  authorId: string,
  content: string
): Promise<void> {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    authorId,
    content,
    likesCount: 0,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(1) });
}

export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);

  return Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      const authorSnap = await getDoc(doc(db, 'users', data.authorId));
      return {
        id: d.id,
        postId,
        ...data,
        author: authorSnap.exists() ? { id: authorSnap.id, ...authorSnap.data() } : null,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      } as Comment;
    })
  );
}

// ── Real-time feed listener ──────────────────────────
export function subscribeFeed(
  callback: (posts: Post[]) => void,
  constraints: QueryConstraint[] = []
) {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20),
    ...constraints
  );

  return onSnapshot(q, async (snap) => {
    const posts = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const authorSnap = await getDoc(doc(db, 'users', data.authorId));
        return toPost(d.id, {
          ...data,
          author: authorSnap.exists() ? { id: authorSnap.id, ...authorSnap.data() } : null,
        });
      })
    );
    callback(posts);
  });
}
