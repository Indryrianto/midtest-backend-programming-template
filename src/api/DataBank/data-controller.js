const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Define the routes
app.get('/users', getUsers);
app.get('/users/:id', getUser);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);
app.put('/users/:id/password', changePassword);

// Define the functions for each route
async function getUsers(request, response) {
  try {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(200).json(results);
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

async function getUser(request, response) {
  try {
    const id = request.params.id;
    const query = `SELECT * FROM users WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return response.status(404).json({ message: 'User not found' });
      }
      return response.status(200).json(results[0]);
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

async function createUser(request, response) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;

    const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error creating user:', err);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(201).json({ message: 'User created successfully' });
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

async function updateUser(request, response) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const query = `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(200).json({ message: 'User updated successfully' });
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteUser(request, response) {
  try {
    const id = request.params.id;

    const query = `DELETE FROM users WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error deleting user:', err);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

async function changePassword(request, response) {
  try {
    const id = request.params.id;
    const password = request.body.password;

    const query = `UPDATE users SET password = '${password}' WHERE id = ${id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error changing password:', err);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(200).json({ message: 'Password changed successfully' });
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return response.status(500).json({ message: 'Internal server error' });
  }
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
