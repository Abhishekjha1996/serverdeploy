const express = require("express");
const userRouter = express.Router();
const { UserModal } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// userRouter.get("/", (req, res) => {
//     res.send("hello")
// })

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const data = await UserModal.findOne({ email: email });
      if (data) {
        res.status(200).send({ msg: "User already exist, please login" });
      } else {
        const user = new UserModal({
          name, email, gender, password: hash,
          age,
          city,
          is_married,
        });
        await user.save();
        res.status(200).send({ msg: "New user has been register" });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

userRouter.post("/login", async(req, res) => {

  const { email, password } = req.body;
    try {
      const user = await UserModal.findOne({ email: email })
      if(user) {
        bcrypt.compare(password, user.password , (err, result) => {
          if(result) {
            res.status(200).send({
              "msg" : "login has been done sucessfully", "token": jwt.sign({"userID":user._id}, "secretkey")})
          } else {
            res.status(400).send({ msg: "login failed" });
          }
        })
      }

    } catch (error) {
      res.status(400).send({ msg: error.message })
    }

  

});

module.exports = {
  userRouter,
};
