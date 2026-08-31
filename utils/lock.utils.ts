import { Mutex } from "async-mutex";

const userLocks = new Map();

export function getUserLock(userId: string) {
  if (!userLocks.has(userId)) {
    userLocks.set(userId, new Mutex());
  }
  return userLocks.get(userId);
}

export function removeUserLock(userId: string) {
  const lock = userLocks.get(userId);

  if (lock && !lock.isLocked()) {
    userLocks.delete(userId);
  }
}
