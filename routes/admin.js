const express = require("express")
const router = express.Router()
const upload = require('./../app')
const admincontroller =  require("./../controller/admin")
router.route("/").get(admincontroller.getadmincontrol)
router.route("/upload", upload.single('design_image')).post(admincontroller.postuploadcontrol)
module.exports = router