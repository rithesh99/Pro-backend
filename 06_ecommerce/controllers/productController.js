const BigPromise = require('../middlewares/bigPromise')
const Product = require('../models/product')
const CustomError = require('../utils/customError')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const WhereClause = require('../utils/whereClause')

exports.addProduct = BigPromise(async (req, res, next) => {
    try {
        if (req.files && req.files.photos) {
            var imageArray = [];
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
    } catch (error) {
        console.log(error)
        for (let index = 0; index < imageArray.length; index++) {
            const imageId = imageArray[index].id;
            const response = await cloudinary.uploader.destroy(imageId)
        }
    }
})

exports.getAllProducts = BigPromise(async (req, res, next) => {

    const resultperPage = 6;
    const totalcountProducts = await Product.countDocuments();

    const productsObj = await new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base;
    const filterProductNumber = products.length;;

    productsObj.pager(resultperPage);
    products = await productsObj.base.clone();

    return res.status(200).json({
        success: true,
        products,
        filterProductNumber,
        totalcountProducts
    })
})

exports.getOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new CustomError("Product not found", 401))
    }
    return res.status(200).json({
        success: true,
        product
    })
})

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
    const products = await Product.find();

    return res.status(200).json({
        success: true,
        products
    })
})

exports.adminUpdateONeProduct = BigPromise(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError("No product found with this id", 401));
    }
    let imagesArray = [];

    if (req.files) {
        //destroy the existing image
        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.v2.uploader.destroy(
                product.photos[index].id
            );
        }

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,
                {
                    folder: "Products", //folder name -> .env
                }
            );

            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }
    }

    req.body.photos = imagesArray;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

exports.adminDeleteOneProduct = BigPromise(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError("No product found with this id", 401));
    }

    //destroy the existing image
    for (let index = 0; index < product.photos.length; index++) {
        const res = await cloudinary.v2.uploader.destroy(product.photos[index].id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product was deleted !",
    });
});
