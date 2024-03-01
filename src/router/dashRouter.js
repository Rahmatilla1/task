const express = require("express");
const router = express.Router();
const isLogin = require("../middleware/checkAuth")
const dashCtrl = require('../controller/dashCtrl')

router.get('/dashboard', isLogin, dashCtrl.dashboard)
router.get('/dashboard/add', isLogin, dashCtrl.addPage)
router.get('/dashboard/item/:id', isLogin, dashCtrl.viewTask)
router.post('/dashboard/add', isLogin, dashCtrl.addTask)
router.post('/dashboard/update/:id', isLogin, dashCtrl.updateTask)
router.get('/dashboard/delete/:id', isLogin, dashCtrl.deleteTask)
router.get('/dashboard/search', isLogin, dashCtrl.searchTask)
router.post('/dashboard/search', isLogin, dashCtrl.searchResult)

module.exports = router