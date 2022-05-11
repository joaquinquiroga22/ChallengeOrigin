const { Router } = require("express");
const router = Router();
const authRouter = require("./auth.js");
const userRouter = require("./user.js");

router.use('/auth', authRouter);
router.use("/users", userRouter);

module.exports = router;
