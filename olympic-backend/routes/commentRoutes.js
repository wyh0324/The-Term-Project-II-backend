const express = require('express');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Country = require('../models/Country');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// 添加评论
router.post('/', authMiddleware, async (req, res) => {
  const { country_id, text, avatar } = req.body;
  const user_id = req.user.id;  // 从 JWT 中获取当前用户的 ID

  try {
    // 检查国家是否存在
    const country = await Country.findByPk(country_id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    // 创建评论
    const comment = await Comment.create({
      user_id,
      country_id,
      text,
      avatar: avatar || 'default-avatar-url', // 默认头像（如果没有提供）
    });

    // 获取评论的详细信息，包括评论者的用户名和头像
    const user = await User.findByPk(user_id);
    const commentDetails = {
      id: comment.id,
      text: comment.text,
      avatar: user.avatar || 'default-avatar-url', // 默认头像
      username: user.username,
    };

    res.status(201).json({ message: 'Comment added', comment: commentDetails });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err });
  }
});

// 获取某个国家的所有评论
router.get('/:country_id', async (req, res) => {
  const { country_id } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { country_id },
      include: [{ model: User, attributes: ['username', 'avatar'] }],
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: 'No comments found for this country' });
    }

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      text: comment.text,
      username: comment.User.username,
      avatar: comment.User.avatar || 'default-avatar-url',
    }));

    res.json(formattedComments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err });
  }
});

module.exports = router;
