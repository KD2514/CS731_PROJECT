const Chat = require('../models/chatModel');

const getChatByCourseId = async (req, res) => {
  const { courseId } = req.params;
  try {
    const chats = await Chat.find({ courseId }).populate('userId', 'name');
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Error fetching chat messages', error });
  }
};

module.exports = {
  getChatByCourseId,
};
