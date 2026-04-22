import { getDbConnection } from './databaseInit';

export const insertUser = async (user) => {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'INSERT INTO users (name, email, phone, cep, street, neighborhood, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    user.name || '', user.email || '', user.phone || '', user.cep || '', user.street || '', user.neighborhood || '', user.city || '', user.state || ''
  );
  return result.lastInsertRowId;
};

export const getUsers = async () => {
  const db = await getDbConnection();
  const allRows = await db.getAllAsync('SELECT * FROM users ORDER BY id DESC');
  return allRows;
};

export const updateUser = async (id, user) => {
  const db = await getDbConnection();
  await db.runAsync(
    'UPDATE users SET name=?, email=?, phone=?, cep=?, street=?, neighborhood=?, city=?, state=? WHERE id=?',
    user.name || '', user.email || '', user.phone || '', user.cep || '', user.street || '', user.neighborhood || '', user.city || '', user.state || '', id
  );
};

export const deleteUser = async (id) => {
  const db = await getDbConnection();
  await db.runAsync('DELETE FROM users WHERE id=?', id);
};

export const deleteAllUsers = async () => {
  const db = await getDbConnection();
  await db.runAsync('DELETE FROM users');
};
