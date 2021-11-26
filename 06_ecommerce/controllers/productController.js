const BigPromise = require('../middlewares/bigPromise')
const Product = require('../models/product')
const CustomError = require('../utils/customError')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/whereClause')

exports.addProduct = BigPromise(async (req, res, next) => {
    if (req.files && req.files.photos) {
        let imageArray = [];
        let files = req.files.photos;
        if (files) {
            for (let index = 0; index < files.length; index++) {
                let result = await cloudinary.uploader.upload(files[index].tempFilePath, {
                    folder: "Products"
                })
                imageArray.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                })
            }
        }
    } else {
        return next(CustomError("Photos are required", 400));
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const { name, price, description, category, brand, photos, user } = req.body;

    if (!name || !price || !category) {
        return next(new CustomError('Name, price and category are required', 400))
    }

    const product = await Product.create(req.body)

    return res.status(200).json({
        success: true,
        product
    })
})

exports.getAllProducts = BigPromise(async (req, res, next) => {

    const resultperPage = 6;
    const totalcountProducts = await Product.countDocuments();

    const products = await new WhereClause(Product.find(), req.query).search().filter();

    const filterProductNumber = products.length;

    products.pager(resultperPage);

    products = await products.base;

    return res.status(200).json({
        success: true,
        products,
        filterProductNumber,
        totalcountProducts
    })
})