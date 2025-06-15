const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');

// GET all branches with pagination and filtering
router.get('/', branchController.getAllBranches);

// GET branch by ID
router.get('/:id', branchController.getBranchById);

// POST create new branch
router.post('/', branchController.createBranch);

// PUT update branch
router.put('/:id', branchController.updateBranch);

// DELETE branch
router.delete('/:id', branchController.deleteBranch);

module.exports = router;




