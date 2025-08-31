const db = require('../models');
const User = db.User;
const Customer = db.Customer;
const Airline = db.Airline;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    if (user.status === 'I') {
      return res.status(403).send({ message: 'Account is inactive.' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      { id: user.userId, role: user.userRole },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).send({
      id: user.userId,
      role: user.userRole,
      token: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.registerCustomer = async (req, res) => {
  try {
    const {
      userId,
      password,
      confirmPassword,
      name,
      dob,
      mobile,
      aadhar,
      email,
      gender,
      city,
      pincode,
      state,
      address,
      securityQuestion,
      securityAnswer
    } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match.' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: 'Invalid email format.' });
    }

    // Validate mobile number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).send({ message: 'Invalid mobile number.' });
    }

    // Validate Aadhar
    if (!/^\d{12}$/.test(aadhar)) {
      return res.status(400).send({ message: 'Invalid Aadhar number.' });
    }

    // Check if user already exists
    const existingUser = await User.findByPk(userId);
    if (existingUser) {
      return res.status(400).send({ message: 'User ID already exists.' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create user
    const user = await User.create({
      userId,
      password: hashedPassword,
      userRole: 'Customer',
      userQstn: securityQuestion,
      userAnswr: securityAnswer,
      status: 'A'
    });

    // Create customer profile
    await Customer.create({
      usrId: userId,
      usrName: name,
      usrDOB: new Date(dob),
      usrGender: gender,
      usrMobNum: mobile,
      usrEmail: email,
      usrCity: city,
      usrPinCode: parseInt(pincode),
      usrState: state,
      usrAddress: address,
      usrAadhar: aadhar,
      usrStatus: 'A'
    });

    res.status(201).send({ message: 'Customer registered successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).send({
      securityQuestion: user.userQstn,
      message: 'Security question retrieved.'
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, securityAnswer, newPassword, confirmPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    if (user.userAnswr !== securityAnswer) {
      return res.status(400).send({ message: 'Incorrect security answer.' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).send({
        message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match.' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    await user.update({ password: hashedPassword });

    res.status(200).send({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);

    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Old password is incorrect.' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).send({
        message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match.' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    await user.update({ password: hashedPassword });

    res.status(200).send({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
