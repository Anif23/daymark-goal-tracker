const Goal = require('../models/goalModel')

const goalsController = {

    getGoals: async (req, res) => {
        const { search = '', page = 1, limit = 8, completed, favorite } = req.query
        const currentPage = Math.max(Number(page) || 1, 1)
        const pageSize = Math.min(Math.max(Number(limit) || 8, 1), 8)
        const filter = { user: req.user.id }

        if (search.trim()) {
            filter.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { desc: { $regex: search.trim(), $options: 'i' } },
            ]
        }
        if (completed === 'true') filter.is_completed = true
        if (completed === 'false') filter.is_completed = false
        if (favorite === 'true') filter.mark_as_fav = true

        const total = await Goal.countDocuments(filter)
        const countFilter = { user: req.user.id }
        const [allCount, activeCount, completedCount, favoriteCount] = await Promise.all([
            Goal.countDocuments(countFilter),
            Goal.countDocuments({ ...countFilter, is_completed: false }),
            Goal.countDocuments({ ...countFilter, is_completed: true }),
            Goal.countDocuments({ ...countFilter, mark_as_fav: true }),
        ])
        const goals = await Goal.find(filter)
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)

        res.status(200).json({
            message: 'Goals fetched Successfully',
            goals,
            pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
            counts: { all: allCount, active: activeCount, completed: completedCount, favorites: favoriteCount },
        })
    },

    createGoals: async (req, res) => {
        const { title, desc } = req.body

        if (!title || !desc) {
            res.status(400)
            throw new Error('Please add a title and description')
        }

        const goal = await Goal.create({
            title, desc,
            user: req.user.id
        })

        res.status(201).json({ message: 'Goal created', goal })
    },

    updateGoal: async (req, res) => {
        const { title, desc } = req.body
        const id = req.params.id

        if (!id) {
            res.status(400)
            throw new Error('Invalid goal ID')
        }

        if (!title && !desc) {
            res.status(400)
            throw new Error('Please add a title or description to update')
        }

        const goal = await Goal.findById(id)

        if (!goal) {
            res.status(404)
            throw new Error('Goal not found')
        }

        const updates = {}
        if (title !== undefined) updates.title = title
        if (desc !== undefined) updates.desc = desc

        const updatedGoal = await Goal.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        res.status(200).json({ message: 'Goal updated', updatedGoal })
    },

    deleteGoal: async (req, res) => {
        const id = req.params.id

        if (!id) {
            res.status(400)
            throw new Error('Invalid goal ID')
        }

        const goal = await Goal.findById(id)

        if (!goal) {
            res.status(404)
            throw new Error('Goal not found')
        }

        await goal.deleteOne()

        res.status(200).json({ message: 'Goal removed', id })
    },

    isGoalCompleted: async (req, res) => {
        const { id } = req.params

        if (!id) {
            res.status(400)
            throw new Error('Invalid goal ID')
        }

        const goal = await Goal.findById(id)

        if (!goal) {
            res.status(404)
            throw new Error('Goal not found')
        }

        goal.is_completed = !goal.is_completed
        await goal.save()

        res.status(200).json({ message: `Goal ${goal.title} is ${goal.is_completed ? 'completed' : 'incomplete'}`, goal })
    },

    isMarkedAsFav: async (req, res) => {
        const { id } = req.params

        if (!id) {
            res.status(400)
            throw new Error('Invalid goal ID')
        }

        const goal = await Goal.findById(id)

        if (!goal) {
            res.status(404)
            throw new Error('Goal not found')
        }

        goal.mark_as_fav = !goal.mark_as_fav
        await goal.save()

        res.status(200).json({
            message: `Goal ${goal.title} is ${goal.mark_as_fav ? 'added into Fav' : 'removed from Fav'}`,
            goal
        })
    },
}

module.exports = goalsController