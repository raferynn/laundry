const express = require("express")
const md5 = require("md5")
const login = express()

login.use(express.json())
const jwt = require("jsonwebtoken")
const secretKey = "rafy"

const models = require("../models/index")
const e = require("express")
const user = models.users

login.post('/', async (request, response) => {
    
    let newLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let dataUser = await user.findOne({
        where: newLogin
    })

    if(dataUser){
        let payload = JSON.stringify(dataUser)
        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token
        })
    }
    else {
        return response.json({
            logged: false,
            message: "u salah"
        })
    }

})

const auth = (request, response, next) => {

    let header = request.headers.authorization

    let token = header && header.split(" ")[1]

    if(token == null){
        return response.status(401).json({
            message: 'Unauthorized'
        })
    }
    else{
        let jwtHeader = {
            algorithm: "HS256"
        }

        jwt.verify(token, secretKey, jwtHeader, error => {
            if (error) {
                return response.status(401).json({
                    message: 'Invalid Token',
                    token: token
                })
            }
            else {
                next()
            }
        })
    }
    
}

module.exports = {login, auth}