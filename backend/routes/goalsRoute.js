const express = require('express')
const router = express.Router()

const { getGoals, createGoals, updateGoal, deleteGoal, isGoalCompleted, isMarkedAsFav } = require('../controller/goalsController')
const protect = require('../middleware/authMiddleware')
const requireVerifiedEmail = protect.requireVerifiedEmail

router.get('/', protect, requireVerifiedEmail, getGoals)
router.post('/', protect, requireVerifiedEmail, createGoals)
router.patch('/:id', protect, requireVerifiedEmail, updateGoal)
router.delete('/:id', protect, requireVerifiedEmail, deleteGoal)
router.post('/is-completed/:id', protect, requireVerifiedEmail, isGoalCompleted)
router.post('/is-marked-fav/:id', protect, requireVerifiedEmail, isMarkedAsFav)

module.exports = () => router