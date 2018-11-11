const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.order_get__all = (req, res, next) => {
    Order
        .find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                order: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:4000/orders/' + doc._id
                        }
                    }
                }),

            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

exports.order_create_order = (req, res, next) => {
    // Zapobieganie dodawaniu zamówień z nieistniejącymi ID produktów
    Product
        .findById(req.body.productID)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found',
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        })
};

exports.order_get_order = (req, res, next) => {
    Order.findById(req.params.orderID)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:400/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};

exports.order_patch_order = (req, res, next) => {
    res.status(200).json({
        message: 'Updated order!',
        orderID: req.params.orderID
    })
};

exports.order_delete_order = (req, res, next) => {
    Order
        .remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:400/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
};