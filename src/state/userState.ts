interface UserState {
  user: { id: number; name: string; documentId: string };
  service: {
    id: number;
    name: string;
    duration: number;
    documentId: string;
  } | null;
  master: { id: number; name: string; documentId: string } | null;
  date: string;
  time: string;
}

const userStates: Map<number, UserState> = new Map();

export const setUserState = (userId: number, state: UserState) => {
  userStates.set(userId, state);
};

export const getUserState = (userId: number) => {
  return userStates.get(userId);
};

export const updateUserState = (
  userId: number,
  partialState: Partial<UserState>,
) => {
  const currentState = userStates.get(userId);
  if (currentState) {
    const updatedState = { ...currentState, ...partialState };
    userStates.set(userId, updatedState);
  }
};
