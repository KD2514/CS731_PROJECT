const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};



exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, email, password, confirmPassword, id } = req.body;

    if (!email || !password || !confirmPassword || !id) {
        return res.status(400).send("Please fill all the details.");
    }

    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }
    const user = await User.findOne({ email: email, id: id });
    if (user) {
        return res.status(401).json({ message: "id already registered." });
    }
    const role = id.startsWith('T') ? 'teacher' : 'student';
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword, id, role });

    try {
        await newUser.save();
        // const token = generateToken(newUser);
        res.send({ message: 'User registered successfully', newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user', error });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.send({ message: 'Login successful', role: user.role, token, id: user.id, _id: user._id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Error logging in', error });
    }
};
