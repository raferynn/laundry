const { request, response } = require("express")
const express = require("express")
const app = express()
const md5 = require("md5")

// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

// membaca request dari body dengan type json
app.use(express.json())

// memanggil models
const models = require("../models/index")

// memanggil model paket
const users = models.users

// end-point get (tampilkan)
app.get("/", async (request, response) => {
    let dataUsers = await users.findAll()

    return response.json(dataUsers)
})

// end-point post (tambahkan)
app.post("/", (request, response) => {
    let newUsers = {
        nama: request.body.nama,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    users.create(newUsers)
    .then(result => {
        response.json({
            message: `data succesfully added!`
        })
    })
    .catch(error => {
        response.json({
            message: `yah eror :(`
        })
    })
})

// end-point update
app.put("/:id_user", (request, response) => {
    let updateUsers = {
        nama: request.body.nama,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    let parameter = {
        id_user: request.params.id_user
    }

    users.update(updateUsers, {where: parameter})
    .then(result => {
        return response.json({
            message: `data succesfully updated!`,
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: `yah eror :(`
        })
    })
})

// end-point delete
app.delete("/:id_user", (request, response) => {
    let hapusUsers = { 
        id_user: request.params.id_user
    }

    users.destroy({where: hapusUsers})
    .then(result => {
        response.json({
            message: `data succesfully deleted`
        })
    })
    .catch(error => {
        response.json({
            message: `yah eror :(`
        })
    })
})

module.exports = app