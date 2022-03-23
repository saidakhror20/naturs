const express = require('express');
const { signup, login, protect, forgotPassword,resetPassword,updatePassword } = require('../controllers/authController');
const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updatePassword',protect, updatePassword)


const {getUsers, addUser, getUser, updateUser, deleteUser} = require('./../controllers/usersController')
router.route('/')
    .get(getUsers)
    .post(addUser)
router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)
module.exports = router
