const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const userController = require('./controllers/userController');
const countryController = require('./controllers/countryController');
const commentController = require('./controllers/commentController');
const adminController = require('./controllers/adminController');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT 验证中间件
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send('Access denied.');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    req.user = decoded;
    next();
  });
}

// 用户路由
app.post('/api/users/register', userController.registerUser);
app.post('/api/users/login', userController.loginUser);

// 国家路由
app.get('/api/countries', countryController.getAllCountries);
app.get('/api/countries/:name', countryController.getCountryDetails);

// 评论路由
app.post('/api/comments', verifyToken, commentController.addComment);
app.get('/api/countries/:countryId/comments', commentController.getCommentsByCountry);

// 管理员路由
app.get('/api/admin/users', verifyToken, adminController.getAllUsers);
app.put('/api/admin/users/:id', verifyToken, adminController.updateUserRole);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
