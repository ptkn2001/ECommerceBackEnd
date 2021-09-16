const router = require('express').Router();
const { Category, Product } = require('../../models');
/////////////////////////////////////
// The `/api/categories` endpoint //
///////////////////////////////////

// get all categories
router.get('/', async(req, res) => {
    try {
        const categoriesData = await Category.findAll({
            include: [{ model: Product }],
        });
        res.status(200).json(categoriesData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get a category by its `id`
router.get('/:id', async(req, res) => {
    try {
        const categoryData = await Category.findByPk(req.params.id, {
            include: [{ model: Product }],
        });

        if (!categoryData) {
            res.status(404).json({
                message: `No category found with id: ${req.params.id}`
            })
            return;
        }

        res.status(200).json(categoryData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// create a new category
router.post('/', async(req, res) => {
    try {
        const categoryData = await Category.create(req.body);
        res.status(200).json(categoryData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// update a category by its `id` value
router.put('/:id', async(req, res) => {
    try {
        const updatedCategory = await Category.update({
            category_name: req.body.category_name,
        }, {
            where: {
                id: req.params.id,
            },
        })

        if (!updatedCategory[0]) {
            res.status(404).json({
                message: `Category was not updated due to one of the following reasons:`,
                reason1: `Category with id: ${req.params.id} does not exist`,
                reason2: `(category_name) was not provided`,
                reason3: `(category_name) provided is the same as the value currently in the database`,
            })
            return;
        }

        res.status(200).json({
            message: `Category with id: ${req.params.id} successfully updated with: ${req.body.category_name}`
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// delete a category by its `id`
router.delete('/:id', async(req, res) => {
    try {
        const categoryData = await Category.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!categoryData) {
            res.status(404).json({ message: `Category with id: ${req.params.id} does not exist.` });
            return;
        }

        res.status(200).json({ message: `Category with id: ${req.params.id} deleted successfully.` });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;