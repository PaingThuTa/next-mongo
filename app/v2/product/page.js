"use client";
import { useState, useEffect } from "react";

import ProductForm from "@/app/v2/components/forms/ProductForm";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const APIBASE = process.env.NEXT_PUBLIC_API_URL;

  const handleEdit = (productData) => {
    setEditData(productData);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`${APIBASE}/product/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const columns = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "price", headerName: "Price", width: 120, type: "number" },
    {
      field: "categoryName",
      headerName: "Category",
      width: 150,
      valueGetter: (params) => params.row.category?.name || 'N/A'
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
          key="edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
          key="delete"
        />,
      ],
    },
  ];

  async function fetchProducts() {
    const data = await fetch(`${APIBASE}/product`);
    const p = await data.json();
    const p2 = p.map((product) => {
      product.id = product._id;
      return product;
    });
    setProducts(p2);
  }

  async function fetchCategories() {
    const data = await fetch(`${APIBASE}/category`);
    const c = await data.json();
    setCategories(c);
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setIsEdit(false);
    setEditData(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditData(null);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  function handleProductFormSubmit(data) {
    if (isEdit && editData) {
      data._id = editData._id;
      fetch(`${APIBASE}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchProducts();
        handleClose();
      });
      return;
    }
    fetch(`${APIBASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchProducts();
      handleClose();
    });
  }

  return (
    <>
      <ResponsiveAppBar />
      <main>
        <div className="mx-4">
          <span>Products ({products.length})</span>
          <IconButton aria-label="new-product" color="secondary" onClick={handleOpen}>
            <AddBoxIcon />
          </IconButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ProductForm
              onSubmit={handleProductFormSubmit}
              editData={editData}
              isEdit={isEdit}
              onCancel={handleClose}
              categories={categories}
            />
          </Modal>
          <DataGrid
            slots={{
              toolbar: GridToolbar,
            }}
            rows={products}
            columns={columns}
          />
        </div>
      </main>
    </>
  );
}
