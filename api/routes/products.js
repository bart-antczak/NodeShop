const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

/* Filtrowanie rozszerzenia uploadowanego pliku */

const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'text/html') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.product_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.product_create_product);

// Indywidualne produkty

router.get('/:productID', ProductsController.product_get_product);

router.patch('/:productID', ProductsController.product_patch_product);

router.delete('/:productID', ProductsController.product_delete_product);

module.exports = router;