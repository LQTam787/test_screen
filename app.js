// Import các module cần thiết
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/thi-trac-nghiem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Lỗi kết nối MongoDB:'));
db.once('open', () => {
  console.log('Đã kết nối đến MongoDB');
});

// Định nghĩa Schema cho câu hỏi
const questionSchema = new mongoose.Schema({
  content: String,
  options: [String],
  correctOptionIndex: Number
});

// Tạo model từ Schema
const Question = mongoose.model('Question', questionSchema);

// Sử dụng bodyParser để parse JSON từ request body
app.use(bodyParser.json());

// API để lấy danh sách câu hỏi
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// API để thêm câu hỏi mới
app.post('/api/questions', async (req, res) => {
  const question = new Question({
    content: req.body.content,
    options: req.body.options,
    correctOptionIndex: req.body.correctOptionIndex
  });
  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API để xóa câu hỏi
app.delete('/api/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa câu hỏi thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Khởi chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
