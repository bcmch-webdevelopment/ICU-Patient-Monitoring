import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initDB, getDB } from './database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

interface Patient {
  id: string;
  patientName: string;
  uhid: string;
  department: string;
  admissionDate: string;
  days: number;
  diagnosis: string;
  status: 'CRITICAL' | 'HIGH RISK' | 'ISOLATION' | 'STABLE';
}

let patients: Patient[] = [
  {
    id: '1',
    patientName: 'John Doe',
    uhid: 'UHID-001',
    department: 'ICU',
    admissionDate: '2023-10-01',
    days: 5,
    diagnosis: 'Acute Myocardial Infarction',
    status: 'CRITICAL',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    uhid: 'UHID-002',
    department: 'CCU',
    admissionDate: '2023-10-03',
    days: 3,
    diagnosis: 'Heart Failure',
    status: 'HIGH RISK',
  },
  {
    id: '3',
    patientName: 'Robert Johnson',
    uhid: 'UHID-003',
    department: 'Neurology',
    admissionDate: '2023-10-05',
    days: 1,
    diagnosis: 'Stroke',
    status: 'ISOLATION',
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    uhid: 'UHID-004',
    department: 'Emergency',
    admissionDate: '2023-10-06',
    days: 0,
    diagnosis: 'Trauma',
    status: 'STABLE',
  },
];

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find((p) => p.id === req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

app.post('/api/patients', (req, res) => {
  const newPatient: Patient = {
    ...req.body,
    id: Math.random().toString(36).substring(2, 9),
  };
  patients.push(newPatient);
  io.emit('patient-created', newPatient);
  res.status(201).json(newPatient);
});

app.put('/api/patients/:id', (req, res) => {
  const index = patients.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...req.body, id: req.params.id };
    io.emit('patient-updated', patients[index]);
    res.json(patients[index]);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

app.delete('/api/patients/:id', (req, res) => {
  const index = patients.findIndex((p) => p.id === req.params.id);
  if (index !== -1) {
    const deletedPatient = patients.splice(index, 1)[0];
    io.emit('patient-deleted', { id: req.params.id });
    res.json(deletedPatient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// User API Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDB();
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user: any) => {
    if (err) {
      res.status(500).json({ message: 'Database error' });
    } else if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        if (user.status !== 'Active') {
          res.status(403).json({ message: 'Account is inactive' });
        } else {
          // Exclude password_hash from response
          const { password_hash, ...userProfile } = user;
          res.json(userProfile);
        }
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  });
});

app.get('/api/users', (req, res) => {
  const db = getDB();
  db.all('SELECT id, full_name as fullName, username, designation, status, created_at FROM users', [], (err, rows) => {
    if (err) res.status(500).json({ message: 'Database error' });
    else res.json(rows);
  });
});

app.post('/api/users', async (req, res) => {
  const { fullName, username, password, designation, status } = req.body;
  const db = getDB();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();
    
    db.run(
      'INSERT INTO users (id, full_name, username, password_hash, designation, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, fullName, username, hashedPassword, designation, status],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ message: 'Username already exists' });
          } else {
            res.status(500).json({ message: 'Database error' });
          }
        } else {
          res.status(201).json({ id, fullName, username, designation, status });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { fullName, username, password, designation, status } = req.body;
  const id = req.params.id;
  const db = getDB();
  
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      db.run(
        'UPDATE users SET full_name = ?, username = ?, password_hash = ?, designation = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [fullName, username, hashedPassword, designation, status, id],
        function (err) {
          if (err) res.status(500).json({ message: 'Database error' });
          else res.json({ id, fullName, username, designation, status });
        }
      );
    } else {
      db.run(
        'UPDATE users SET full_name = ?, username = ?, designation = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [fullName, username, designation, status, id],
        function (err) {
          if (err) res.status(500).json({ message: 'Database error' });
          else res.json({ id, fullName, username, designation, status });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const db = getDB();
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) res.status(500).json({ message: 'Database error' });
    else res.json({ message: 'User deleted' });
  });
});

const PORT = 5000;
initDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
