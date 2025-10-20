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
    password: '',
    database: 'mahasiswa',
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.post('api/users', (req, res) => {
    const { nama, nim, kelas} = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).json({ message: 'nama, nim, kelas wajib diisi' });
    }

    db.query('INSERT INTO users (nama, nim, kelas) VALUES (?, ?, ?)', 
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