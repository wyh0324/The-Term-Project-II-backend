const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 注册新用户
const registerUser = (req, res) => {
  const { username, password } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'User registered successfully' });
  });
};

// 用户登录
const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('User not found.');

    const user = result[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send('Invalid password.');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

// 获取所有用户（管理员权限）
const getAllUsers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('You are not authorized to access this page.');
  }

  db.query('SELECT id, username, role FROM users', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// 更新用户角色（管理员权限）
const updateUserRole = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('You are not authorized to access this page.');
  }

  const { role } = req.body;
  db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User role updated successfully' });
  });
};

module.exports = { registerUser, loginUser, getAllUsers, updateUserRole };
