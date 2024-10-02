import Product from "../models/product.model.js";
import { redis } from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("error in fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//.lean() convert mongoose object to javascript object instead of mongoose schema

// export const getFeaturedProducts = async (req, res) => {
//   try {
//     let featuredProducts = await redis.get("featured_products");
//     if (featuredProducts) {
//       return res.json(JSON.parse(featuredProducts));
//     }

//     // if not in redis, fetch from mongodb
//     // .lean() is gonna return a plain javascript object instead of a mongodb document
//     // which is good for performance
//     featuredProducts = await Product.find({ isFeatured: true }).lean();

//     if (!featuredProducts) {
//       return res.status(404).json({ message: "No featured products found" });
//     }

//     // store in redis for future quick access

//     await redis.set("featured_products", JSON.stringify(featuredProducts));

//     res.json(featuredProducts);
//   } catch (error) {
//     console.log("Error in getFeaturedProducts controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // If not in Redis, fetch from MongoDB
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    // Store the result in Redis for future use
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    // Return the newly fetched data
    res.json(featuredProducts);
  } catch (error) {
    console.error("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(200).json(product);
  } catch (error) {
    console.log("error in creating product controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     if (product.image) {
//       const publicId = product.image.split("/").pop().split(".")[0]; // get id of image
//       try {
//         await cloudinary.uploader.destroy(`products/${publicId}`); // delete image from cloudinary
//         console.log("deleted image from cloudinary");
//       } catch (error) {
//         console.log("error delete image from cloudinary");
//       }
//     }
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.log("error in deleting product:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const deleteProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the product has an associated image, delete it from Cloudinary
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0]; // Extract the public ID
        await cloudinary.uploader.destroy(`products/${publicId}`); // Delete from Cloudinary
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error.message);
        return res.status(500).json({
          message: "Error deleting image from Cloudinary",
          error: error.message,
        });
      }
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleting product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 2 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("error in fetching recommended product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Toggle the isFeatured property
    product.isFeatured = !product.isFeatured;

    // Save the updated product
    const updatedProduct = await product.save();

    // Update cache if needed
    await updateFeatureProductsCache();

    // Send the updated product back in the response
    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in toggling featured product:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
async function updateFeatureProductsCache() {
  try {
    const featureProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featureProducts)); // Fix here
  } catch (error) {
    console.log("error in updating feature products cache:", error.message);
  }
}
