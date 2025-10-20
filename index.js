const express = require('express');
let mysql = require('mysql2');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'KopiMokachino_05',
    database: 'mahasiswa',
    port: '3310'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.post('/api/users', (req, res) => {
    const { nama, nim, kelas} = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).json({ message: 'nama, nim, kelas wajib diisi' });
    }

    db.query('INSERT INTO Mahasiswa (nama, nim, kelas) VALUES (?, ?, ?)', 
        [nama, nim, kelas], 
        (err, result) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).json({ message: 'Database Error' });
            }
            res.status(201).json({ message: 'User added successfully', userId: result.insertId });
        }
    );
});

app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { nama, nim, kelas } = req.body;
    db.query(
        'UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ? WHERE id = ?',
        [nama, nim, kelas, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database Error' });
            }
            res.status(200).json({ message: 'User updated successfully' });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query(
        'DELETE FROM mahasiswa WHERE id = ?',
        [userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database Error' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        }
    );
});