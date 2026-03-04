import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { User, UserRole } from '@/types';

// ── Convert Firebase user to our User type ───────────
async function getOrCreateUserDoc(firebaseUser: FirebaseUser, extra?: { role?: UserRole; displayName?: string }): Promise<User> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as User;
  }

  // New user — create their document
  const newUser: Omit<User, 'id'> = {
    email: firebaseUser.email ?? '',
    displayName: extra?.displayName ?? firebaseUser.displayName ?? 'Artista User',
    username: (firebaseUser.email ?? '').split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase(),
    role: extra?.role ?? 'enthusiast',
    verified: false,
    followersCount: 0,
    followingCount: 0,
    worksCount: 0,
    createdAt: new Date(),
    artInterests: [],
  };

  await setDoc(ref, { ...newUser, createdAt: serverTimestamp() });
  return { id: firebaseUser.uid, ...newUser };
}

// ── Sign Up ──────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return getOrCreateUserDoc(cred.user, { role, displayName });
}

// ── Sign In ──────────────────────────────────────────
export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return getOrCreateUserDoc(cred.user);
}

// ── Google Sign In ───────────────────────────────────
export async function signInWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return getOrCreateUserDoc(cred.user);
}

// ── Sign Out ─────────────────────────────────────────
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// ── Auth state listener ──────────────────────────────
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    try {
      const user = await getOrCreateUserDoc(firebaseUser);
      callback(user);
    } catch {
      callback(null);
    }
  });
}
