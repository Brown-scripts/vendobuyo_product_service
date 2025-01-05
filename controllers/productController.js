const Product = require('../models/Product');
const upload = require('../utils/upload');
const s3 = require('../utils/aws-config');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stockQuantity } = req.body;

    // Check if the file exists in the request
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const image = req.files.image;

    // Set up S3 upload parameters
    const params = {
      Bucket: 'eneye-images', // Replace with your S3 bucket name
      Key: `products/${Date.now()}-${image.name}`, // File name in S3
      Body: image.data, // File data
      ContentType: image.mimetype, // File MIME type
      ACL: 'public-read', // Access control (public-read allows public access)
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(params).promise();

    // Create a new product in the database
    const product = new Product({
      title,
      description,
      price,
      imageUrl: uploadResult.Location, // The public URL of the uploaded image
      stockQuantity,
      sellerId: req.user.userId,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    // Extract product ID from route parameters
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return product details
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);

    // Handle invalid ObjectId error specifically
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    res.status(500).json({ message: 'Error fetching product', error });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, imageUrl, stockQuantity } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: id, sellerId: req.user.userId },
      { title, description, price, imageUrl, stockQuantity },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID and sellerId
    const product = await Product.findOne({ _id: id, sellerId: req.user.userId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // Extract the S3 object key from the imageUrl
    const imageUrl = product.imageUrl;
    const bucketName = 'eneye-images'; // Your S3 bucket name
    const region = 'eu-north-1'; // Your bucket region

    // Validate the image URL
    const bucketDomain = `https://${bucketName}.s3.amazonaws.com/`;
    // console.log('bd: ', bucketDomain)
    // console.log('url: ', imageUrl)
    // console.log('startwith: ', imageUrl.startsWith(bucketDomain))

    if (!imageUrl.startsWith(bucketDomain)) {
      return res.status(400).json({ message: 'Invalid image URL' });
    }

    // Extract the key
    const key = imageUrl.replace(bucketDomain, '');

    // Delete the image from the S3 bucket
    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    res.json({ message: 'Product and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    // Extract sellerId from authenticated user
    const sellerId = req.user.userId;

    // Fetch products belonging to the seller
    const products = await Product.find({ sellerId });

    // Check if products exist
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }

    // Return the seller's products
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Error fetching seller products', error });
  }
};