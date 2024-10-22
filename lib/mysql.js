import connection from './database';
import { v4 as uuidv4 } from 'uuid';

// Create User
export async function createUser(email, password, username) {
  try {
    const [result] = await connection.execute(
      'INSERT INTO users (accountId, email, username, avatar) VALUES (?, ?, ?, ?)', 
      [uuidv4(), email, username, `https://avatars.dicebear.com/api/initials/${username}.svg`]
    );
    if (result.affectedRows === 0) throw new Error('Account creation failed');
    await signIn(email, password);
    const [newUser] = await connection.execute('SELECT * FROM users WHERE email = ? AND username = ?', [email, username]);
    return newUser[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const sessionToken = uuidv4();
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length === 0) throw new Error('Invalid email or password');
    const userId = users[0].id;
    await connection.execute('INSERT INTO sessions (userId, sessionToken) VALUES (?, ?)', [userId, sessionToken]);
    return { userId, sessionToken };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Account
export async function getAccount(sessionToken) {
  try {
    const [sessions] = await connection.execute('SELECT * FROM sessions WHERE sessionToken = ?', [sessionToken]);
    if (sessions.length === 0) throw new Error('Session not found');
    const userId = sessions[0].userId;
    const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return users[0];
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get Current User
export async function getCurrentUser(sessionToken) {
  try {
    const account = await getAccount(sessionToken);
    if (!account) throw new Error('Account not found');
    return account;
  } catch (error) {
    return null;
  }
}

// Sign Out
export async function signOut(sessionToken) {
  try {
    await connection.execute('DELETE FROM sessions WHERE sessionToken = ?', [sessionToken]);
  } catch (error) {
    throw new Error(error.message);
  }
}
