const { request, response } = require("express")
const express = require("express")
const app = express()

// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

// membaca request dari body dengan type json
app.use(express.json())

// memanggil models
const models = require("../models/index")

// memanggil model member
const member = models.member

// end-point get (tampilkan)
app.get("/", async (request, response) => {
    let dataMember = await member.findAll()

    return response.json(dataMember)
})

// end-point post (tambahkan)
app.post("/", (request, response) => {
    let newMember = {
        nama: request.body.nama,
        alamat: request.body.alamat,
        jenis_kelamin: request.body.jenis_kelamin,
        telepon: request.body.telepon
    }

    member.create(newMember)
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
app.put("/:id_member", (request, response) => {
    let updateMember = {
        nama: request.body.nama,
        alamat: request.body.alamat,
        jenis_kelamin: request.body.jenis_kelamin,
        telepon: request.body.telepon
    }

    let parameter = {
        id_member: request.params.id_member
    }

    member.update(updateMember, {where: parameter})
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
app.delete("/:id_member", (request, response) => {
    let hapusMember = { 
        id_member: request.params.id_member
    }

    member.destroy({where: hapusMember})
    .then(result => {
        response.json({
            message: `data succesfully deleted`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

module.exports = app