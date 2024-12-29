const db = require('../config/db');

// 添加评论
const addComment = (req, res) => {
  const { countryId, text } = req.body;
  const userId = req.user.id;

  db.query('INSERT INTO comments (countryId, userId, text) VALUES (?, ?, ?)', [countryId, userId, text], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Comment added successfully' });
  });
};

// 获取国家的所有评论
const getCommentsByCountry = (req, res) => {
  const { countryId } = req.params;

  db.query('SELECT comments.*, users.username, users.avatar FROM comments JOIN users ON comments.userId = users.id WHERE countryId = ?', [countryId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

module.exports = { addComment, getCommentsByCountry };
