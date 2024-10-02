import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

let toastId = null;

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      toastId = toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to delete product");
    }
  },
  // toggleFeaturedProduct: async (productId) => {
  //   // Optimistically toggle the UI immediately
  //   set((prevProducts) => ({
  //     loading: true,
  //     products: prevProducts.products.map((product) =>
  //       product._id === productId
  //         ? { ...product, isFeatured: !product.isFeatured } // Toggle the isFeatured state
  //         : product
  //     ),
  //   }));

  //   try {
  //     const response = await axios.patch(`/products/${productId}`);

  //     console.log("Server response:", response.data); // Debugging step to ensure correct response

  //     // Update state with server response
  //     set((prevProducts) => ({
  //       products: prevProducts.products.map((product) =>
  //         product._id === productId
  //           ? { ...product, isFeatured: response.data.isFeatured } // Update with server's value
  //           : product
  //       ),
  //       loading: false,
  //     }));
  //     if (toastId) toast.dismiss(toastId);
  //     toastId = toast.success("Product updated successfully");
  //   } catch (error) {
  //     console.error("Error:", error.response?.data?.error || error.message);

  //     // Rollback the optimistic update on failure
  //     set((prevProducts) => ({
  //       products: prevProducts.products.map((product) =>
  //         product._id === productId
  //           ? { ...product, isFeatured: !product.isFeatured } // Revert the optimistic toggle
  //           : product
  //       ),
  //       loading: false,
  //     }));

  //     toast.error("Failed to update product");
  //   }
  // },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true }); // Clear previous errors and set loading to true
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.error("Error fetching featured products:", error.message);
    }
  },
}));
