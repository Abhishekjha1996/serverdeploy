const express = require("express");
const postRouter = express.Router();
const {PostModal} = require("../model/posts.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

postRouter.get("/posts", async (req, res)=> {
    
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, "secretkey")
    const {min, max, device, device1, device2} = req.query
    try {
     if(decode) {
        if(min && max) {
            const data = await PostModal.find({$and: [{no_of_comments: {$lte: max}}, {no_of_comments: {$gte: min}} ]})
            res.status(200).send(data)

        } else if(device) {
            const data = await PostModal.find({device: device})
            res.status(200).send(data)

        }else if (device1 || device2) {
            const data = await PostModal.find({$or:[{ device: device1}, {device: device2}]})
            res.status(200).send(data)

        } else {
            const data = await PostModal.find({"userID": decode.userID})
        res.status(200).send(data)
        }
     }   
    } catch (error) {
        res.status(400).send({ msg: error.message })
    }

})


postRouter.post("/add", async(req, res)=> {
        const data = req.body

        try {
            const newdata = new PostModal(data)
            await newdata.save()
            res.status(200).send({"msg": "data has been posted by user"})
        } catch (error) {
            res.status(400).send({ msg: error.message })
        }

})

postRouter.patch("/update/:id", async(req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, "secretkey")
    const id = req.params.id
    const req_id = decode.userID
    const post = await PostModal.findOne({_id: id})
    const user_id = post.userID
    const newdata = req.body
    try {
        if(req_id == user_id) {
            await PostModal.findByIdAndUpdate({_id: id}, newdata)
            res.status(200).send({"msg": "data has been updated"})
        }else {
            res.status(400).send({"msg": "please login first to updated"})
        }

    } catch (error) {
        res.status(400).send({ msg: error.message })
    }

})


postRouter.delete("/delete/:id", async(req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decode = jwt.verify(token, "secretkey")
    const id = req.params.id
    const req_id = decode.userID
    const post = await PostModal.findOne({_id: id})
    const user_id = post.userID
    const newdata = req.body
    try {
        if(req_id == user_id) {
            await PostModal.findByIdAndDelete({_id: id})
            res.status(200).send({"msg": "data has been deleted"})
        }else {
            res.status(400).send({"msg": "please login first to delete"})
        }

    } catch (error) {
        res.status(400).send({ msg: error.message })
    }

})



module.exports = {
    postRouter
}
