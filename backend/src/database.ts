import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDB = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          designation TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, async (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        } else {
          console.log('Users table ready.');
          await seedAdminUser();
          resolve();
        }
      });
    });
  });
};

const seedAdminUser = () => {
  return new Promise<void>((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        const id = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);
        
        db.run(
          'INSERT INTO users (id, full_name, username, password_hash, designation, status) VALUES (?, ?, ?, ?, ?, ?)',
          [id, 'Administrator', 'admin', hashedPassword, 'Administrator', 'Active'],
          (err) => {
            if (err) {
              console.error('Error seeding admin user:', err);
              reject(err);
            } else {
              console.log('Admin user seeded successfully. Username: admin, Password: admin');
              resolve();
            }
          }
        );
      } else {
        resolve(); // Admin already exists
      }
    });
  });
};

export const getDB = () => db;
