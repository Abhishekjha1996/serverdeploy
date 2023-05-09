const express = require("express")
const { connection } = require("./db")
const { userRouter } = require("./route/user.route")
const { postRouter} = require("./route/post.route")
const { auth } = require("./middleware/auth")
const cors = require('cors')
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())


app.use("/users", userRouter)

app.use(auth)

app.use("/posts", postRouter)


app.listen(process.env.PORT, async() => {

    try {
        
        await connection 
        console.log("mongoatlas")


    } catch (error) {
        console.log(error)
    }

    console.log("server running")
})