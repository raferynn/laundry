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

// memanggil model transaksi
const transaksi = models.transaksi

//memanggil model detail transaksi
const detail_transaksi = models.detail_transaksi

// end-point get (tampilkan)
app.get("/", async (request, response) => {
    let dataTransaksi = await transaksi.findAll({
        include: [
            {model: models.member, as: "member"},
            {model: models.users, as: "user"},
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: [
                    {model: models.paket, as: "paket"}
                ]
            }
        ]
    })
    return response.json(dataTransaksi)
})

//end-point post (tambahkan)
app.post("/", (request, response) => {
    let newTransaksi = {
        id_member:request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu:request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: request.body.status,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user

    }
    
    transaksi.create(newTransaksi)
    .then(result => {
        let newIdTransaksi = result.id_transaksi

        let detail = request.body.detail_transaksi
        for (let i=0; i<detail.length; i++){
            detail[i].id_transaksi = newIdTransaksi
        }

        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `detail transaksi is succesfully added`
            })
        })
        .catch(error => {
            response.json({
                message: `yah eror :(`
            })
        })
    })
    .catch(error => {
        response.json({
            message: `yah eror :(`
        })
    })
})

app.put("/:id_transaksi", async (request, response) =>{
    let dataTransaksi = {
        id_member:request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu:request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: request.body.status,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user
    }

    let parameter = {
        id_transaksi: request.params.id_transaksi
    }


    transaksi.update(dataTransaksi, {where: parameter})
    .then(async(result) => {
        await detail_transaksi.destroy({where: parameter })

        let detail = request.body.detail_transaksi
        for (let i=0; i<detail.length; i++) {
            detail[i].id_transaksi = request.params.id_transaksi
        }

        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `data successfully updated`
            })
        })
        .catch(error => {
            return response.json({
                message: `yah eror :(`
            })
        })
    })
    .catch(error => {
        return response.json({
            message: `yah eror :(`
        })
    })
})

app.delete("/:id_transaksi", (request, response) => {
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    detail_transaksi.destroy({where: parameter})
    .then(result => {
        transaksi.destroy({where: parameter})
        .then(result => {
            return response.json({
                message: `data successfully deleted`
            })
        })
        .catch(error => {
            return response.json({
                message: `yah eror :(`
            })
        })
    })
    .catch(error => {
        return response.json({
            message: `yah eror :(`
        })
    })
})

app.post("/status/:id_transaksi", (request, response) => {
    let data = {
        status: request.body.status
    }

    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: "status successfully updated"
        })
    })
    .catch(error => {
        return response.json({
            message: "yah eror :("
        })
    })
})

app.get("/pembayaran/:id_transaksi", (request, response) => {
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    let data = {
        tgl_dibayar: new Date().toISOString().split("T")[0],
        dibayar: true
    }

    transaksi.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: "payment confirmed"
        })
    })
    .catch(error => {
        message: "yah eror :("
    })
})


module.exports = app