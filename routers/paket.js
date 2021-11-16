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

// memanggil model paket
const paket = models.paket

// end-point get (tampilkan)
app.get("/", async (request, response) => {
    let dataPaket = await paket.findAll()

    return response.json(dataPaket)
})

// end-point post (tambahkan)
app.post("/", (request, response) => {
    let newPaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    paket.create(newPaket)
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
app.put("/:id_paket", (request, response) => {
    let updatePaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    let parameter = {
        id_paket: request.params.id_paket
    }

    paket.update(updatePaket, {where: parameter})
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
app.delete("/:id_paket", (request, response) => {
    let hapusPaket = { 
        id_paket: request.params.id_paket
    }

    paket.destroy({where: hapusPaket})
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