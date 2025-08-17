const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid Password!' });
    }

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