import {
  doc, setDoc, deleteDoc, getDoc, updateDoc, increment, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ── Follow / Unfollow ────────────────────────────────
export async function followUser(followerId: string, targetId: string): Promise<void> {
  const followRef = doc(db, 'follows', `${followerId}_${targetId}`);
  await setDoc(followRef, {
    followerId,
    targetId,
    createdAt: serverTimestamp(),
  });
  // Update counts
  await updateDoc(doc(db, 'users', followerId), { followingCount: increment(1) });
  await updateDoc(doc(db, 'users', targetId),   { followersCount: increment(1) });
}

export async function unfollowUser(followerId: string, targetId: string): Promise<void> {
  await deleteDoc(doc(db, 'follows', `${followerId}_${targetId}`));
  await updateDoc(doc(db, 'users', followerId), { followingCount: increment(-1) });
  await updateDoc(doc(db, 'users', targetId),   { followersCount: increment(-1) });
}

export async function isFollowing(followerId: string, targetId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'follows', `${followerId}_${targetId}`));
  return snap.exists();
}

// ── Get follow status for multiple users ─────────────
export async function getFollowStatuses(
  followerId: string,
  targetIds: string[]
): Promise<Set<string>> {
  const following = new Set<string>();
  await Promise.all(
    targetIds.map(async (targetId) => {
      const snap = await getDoc(doc(db, 'follows', `${followerId}_${targetId}`));
      if (snap.exists()) following.add(targetId);
    })
  );
  return following;
}
