const express = require('express')
const router = express.Router()
const {protect, restrictTo} = require('../controllers/authController');
const {getAllTours, addTour, getTour, updateTour, deleteTour, aliasTopTours, aliasTopCheapest, getTourStats, getMonthlyPlan} = require('../controllers/toursController')

router.route('/tour-plan/:year').get(getMonthlyPlan)
router.route('/top-cheapest').get(aliasTopCheapest, getAllTours)
router.route('/top-tours').get(aliasTopTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/')
    .get(protect, getAllTours)
    .post(addTour)

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect,restrictTo('admin', 'lead-guide'), deleteTour)
module.exports = router;

// ('www.natours.com/admin')