const express = require('express');
const router = express.Router();

const usersController = require('./data-controller');
const usersValidator = require('./data-validator');

// Get list of users
router.get('/', usersController.getUsers);

// Create user
router.post(
  '/',
  celebrate(usersValidator.createUser),
  usersController.createUser
);

// Get user detail
router.get('/:id', usersController.getUser);

// Update user
router.put(
  '/:id',
  celebrate(usersValidator.updateUser),
  usersController.updateUser
);

// Delete user
router.delete('/:id', usersController.deleteUser);

// Change password
router.post(
  '/:id/change-password',
  celebrate(usersValidator.changePassword),
  usersController.changePassword
);

module.exports = router;
