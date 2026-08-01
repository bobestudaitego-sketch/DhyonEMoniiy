import {
  db,
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs
} from './firebase';
import { ScheduleItem, JournalEntry, LoveLetter, PrivateNote } from '../types';

// Helper to remove undefined values before saving to Firestore
function sanitizeData<T extends object>(data: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      clean[key] = val;
    }
  }
  return clean;
}

// 1. SCHEDULE ITEMS
export function subscribeScheduleItems(
  onData: (items: ScheduleItem[]) => void,
  initialFallback: ScheduleItem[]
) {
  const colRef = collection(db, 'scheduleItems');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty && initialFallback.length > 0) {
        // Seed initial items to Firestore
        initialFallback.forEach((item) => {
          setDoc(doc(db, 'scheduleItems', item.id), sanitizeData(item)).catch(console.error);
        });
        onData(initialFallback);
      } else {
        const items: ScheduleItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as ScheduleItem);
        });
        // Sort descending by createdAt or date
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onData(items);
      }
    },
    (err) => {
      console.warn('Firestore scheduleItems snapshot error:', err);
    }
  );
}

export async function saveScheduleItemToCloud(item: ScheduleItem) {
  try {
    await setDoc(doc(db, 'scheduleItems', item.id), sanitizeData(item));
  } catch (err) {
    console.error('Error saving schedule item to cloud:', err);
  }
}

export async function deleteScheduleItemFromCloud(itemId: string) {
  try {
    await deleteDoc(doc(db, 'scheduleItems', itemId));
  } catch (err) {
    console.error('Error deleting schedule item from cloud:', err);
  }
}

// 2. JOURNAL ENTRIES
export function subscribeJournalEntries(
  onData: (entries: JournalEntry[]) => void,
  initialFallback: JournalEntry[]
) {
  const colRef = collection(db, 'journalEntries');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty && initialFallback.length > 0) {
        initialFallback.forEach((entry) => {
          setDoc(doc(db, 'journalEntries', entry.id), sanitizeData(entry)).catch(console.error);
        });
        onData(initialFallback);
      } else {
        const entries: JournalEntry[] = [];
        snapshot.forEach((docSnap) => {
          entries.push(docSnap.data() as JournalEntry);
        });
        // Sort by date/time descending
        entries.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
        onData(entries);
      }
    },
    (err) => {
      console.warn('Firestore journalEntries snapshot error:', err);
    }
  );
}

export async function saveJournalEntryToCloud(entry: JournalEntry) {
  try {
    await setDoc(doc(db, 'journalEntries', entry.id), sanitizeData(entry));
  } catch (err) {
    console.error('Error saving journal entry to cloud:', err);
  }
}

export async function deleteJournalEntryFromCloud(entryId: string) {
  try {
    await deleteDoc(doc(db, 'journalEntries', entryId));
  } catch (err) {
    console.error('Error deleting journal entry from cloud:', err);
  }
}

// 3. LOVE LETTERS
export function subscribeLoveLetters(
  onData: (letters: LoveLetter[]) => void,
  initialFallback: LoveLetter[]
) {
  const colRef = collection(db, 'loveLetters');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty && initialFallback.length > 0) {
        initialFallback.forEach((letter) => {
          setDoc(doc(db, 'loveLetters', letter.id), sanitizeData(letter)).catch(console.error);
        });
        onData(initialFallback);
      } else {
        const letters: LoveLetter[] = [];
        snapshot.forEach((docSnap) => {
          letters.push(docSnap.data() as LoveLetter);
        });
        letters.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onData(letters);
      }
    },
    (err) => {
      console.warn('Firestore loveLetters snapshot error:', err);
    }
  );
}

export async function saveLoveLetterToCloud(letter: LoveLetter) {
  try {
    await setDoc(doc(db, 'loveLetters', letter.id), sanitizeData(letter));
  } catch (err) {
    console.error('Error saving love letter to cloud:', err);
  }
}

export async function deleteLoveLetterFromCloud(letterId: string) {
  try {
    await deleteDoc(doc(db, 'loveLetters', letterId));
  } catch (err) {
    console.error('Error deleting love letter from cloud:', err);
  }
}

// 4. PRIVATE NOTES
export function subscribePrivateNotes(
  onData: (notes: PrivateNote[]) => void,
  initialFallback: PrivateNote[]
) {
  const colRef = collection(db, 'privateNotes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty && initialFallback.length > 0) {
        initialFallback.forEach((note) => {
          setDoc(doc(db, 'privateNotes', note.id), sanitizeData(note)).catch(console.error);
        });
        onData(initialFallback);
      } else {
        const notes: PrivateNote[] = [];
        snapshot.forEach((docSnap) => {
          notes.push(docSnap.data() as PrivateNote);
        });
        notes.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onData(notes);
      }
    },
    (err) => {
      console.warn('Firestore privateNotes snapshot error:', err);
    }
  );
}

export async function savePrivateNoteToCloud(note: PrivateNote) {
  try {
    await setDoc(doc(db, 'privateNotes', note.id), sanitizeData(note));
  } catch (err) {
    console.error('Error saving private note to cloud:', err);
  }
}

export async function deletePrivateNoteFromCloud(noteId: string) {
  try {
    await deleteDoc(doc(db, 'privateNotes', noteId));
  } catch (err) {
    console.error('Error deleting private note from cloud:', err);
  }
}

// 5. TREASURE HUNT STATE
export interface TreasureHuntCloudState {
  currentStageIndex: number;
  isProposalAccepted: boolean;
  proposalMessage: string;
  gameUrl: string;
  openedChests: boolean[];
  isHuntEnabled?: boolean;
  updatedAt?: string;
}

export function subscribeTreasureHuntState(
  onData: (state: TreasureHuntCloudState) => void,
  fallback: TreasureHuntCloudState
) {
  const docRef = doc(db, 'treasureHunt', 'shared_state');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as TreasureHuntCloudState);
      } else {
        // Initialize default document
        setDoc(docRef, sanitizeData(fallback)).catch(console.error);
        onData(fallback);
      }
    },
    (err) => {
      console.warn('Firestore treasureHunt snapshot error:', err);
    }
  );
}

export async function saveTreasureHuntStateToCloud(state: Partial<TreasureHuntCloudState>) {
  try {
    const docRef = doc(db, 'treasureHunt', 'shared_state');
    await setDoc(docRef, { ...sanitizeData(state), updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.error('Error saving treasure hunt state to cloud:', err);
  }
}

// CLEAR ALL POSTS
export async function clearAllCloudPosts() {
  try {
    const itemsSnap = await getDocs(collection(db, 'scheduleItems'));
    itemsSnap.forEach((d) => deleteDoc(d.ref));

    const journalSnap = await getDocs(collection(db, 'journalEntries'));
    journalSnap.forEach((d) => deleteDoc(d.ref));
  } catch (err) {
    console.error('Error clearing cloud posts:', err);
  }
}
