import { setUserState, getUserState, updateUserState } from '../../state/userState';

describe('UserState management', () => {
  it('should set user state', () => {
    const userId = 1;
    const userState = {
      user: { id: 1, name: 'Test User', documentId: 'dsfsdf1' },
      service: { id: 1, name: 'Service 1', duration: 30, documentId: 'dsfsdf2' },
      master: { id: 1, name: 'Master 1', documentId: 'dsfsdf3' },
      date: '2024-10-12',
      time: '10:00',
    };
    
    setUserState(userId, userState);
    const result = getUserState(userId);
    
    expect(result).toEqual(userState);
  });
  
  it('should get user state', () => {
    const userId = 2;
    const userState = {
      user: { id: 2, name: 'Test User 2', documentId: 'dsfsdf1' },
      service: null,
      master: null,
      date: '',
      time: '',
    };
    
    setUserState(userId, userState);
    const result = getUserState(userId);
    
    expect(result).toEqual(userState);
  });
  
  it('should update user state partially', () => {
    const userId = 3;
    const initialUserState = {
      user: { id: 3, name: 'Test User 3', documentId: 'dsfsdf1' },
      service: null,
      master: null,
      date: '',
      time: '',
    };
    
    setUserState(userId, initialUserState);
    
    const partialUpdate = {
      service: { id: 2, name: 'Service 2', duration: 45, documentId: 'dsfsdf2' },
      date: '2024-10-13',
    };
    
    updateUserState(userId, partialUpdate);
    const result = getUserState(userId);
    
    expect(result).toEqual({
      user: { id: 3, name: 'Test User 3' },
      service: { id: 2, name: 'Service 2', duration: 45 },
      master: null,
      date: '2024-10-13',
      time: '',
    });
  });
  
  it('should not update state if user does not exist', () => {
    const userId = 4;
    const partialUpdate = {
      service: { id: 3, name: 'Service 3', duration: 60, documentId: 'dsfsdf1' },
    };
    
    updateUserState(userId, partialUpdate);
    const result = getUserState(userId);
    
    expect(result).toBeUndefined();
  });
});
