const db = require('../config/db');

// 获取所有用户
const getAllUsers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }

  db.query('SELECT id, username, role FROM users', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// 更新用户角色
const updateUserRole = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }

  const { role } = req.body;
  db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User role updated successfully' });
  });
};

module.exports = { getAllUsers, updateUserRole };
