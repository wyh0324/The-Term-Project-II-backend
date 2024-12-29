const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// 获取所有用户（仅管理员访问）
router.get('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, only admins can view all users' });
  }

  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role'],  // 只返回 id、username 和 role 字段
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// 获取用户信息（通过用户ID）
router.get('/:id', authMiddleware, async (req, res) => {
  const userId = req.params.id;

  // 确保用户只能查看自己的信息，或者管理员可以查看任何用户的信息
  if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'role'],  // 返回用户的基本信息
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user information', error: err });
  }
});

// 更新用户角色（管理员可以升级或降级用户）
router.put('/:id/role', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, only admins can change user roles' });
  }

  const userId = req.params.id;
  const { role } = req.body;  // 期望的角色值（admin 或 registered）

  if (!['admin', 'registered'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err });
  }
});

// 删除用户（仅管理员可以执行）
router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, only admins can delete users' });
  }

  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

module.exports = router;
