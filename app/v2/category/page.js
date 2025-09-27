"use client";
import { useState, useEffect } from "react";

import CategoryForm from "@/app/v2/components/forms/CategoryForm";
import Link from "next/link";

import { DataGrid, GridToolbar, GridRowsProp, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

import Modal from "@mui/material/Modal";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";

import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  console.log(`${APIBASE}/category`);

  const handleEdit = (categoryData) => {
    setEditData(categoryData);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`${APIBASE}/category/${id}`, {
        method: "DELETE",
      });
      fetchCategory();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Category Name", width: 200 },
    { field: "order", headerName: "Order", width: 120, type: "number" },
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

  async function fetchCategory() {
    const data = await fetch(`${APIBASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      category.id = category._id;
      return category;
    });
    setCategory(c2);
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
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (isEdit && editData) {
      data._id = editData._id;
      fetch(`${APIBASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchCategory();
        handleClose();
      });
      return;
    }
    fetch(`${APIBASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCategory();
      handleClose();
    });
  }

  return (
    <main>
      {/* <form onSubmit={handleSubmit(createCategory)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4">
          <div>Category:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true, defaultValue: 0 })}
              className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="col-span-2 text-right">
            {editMode ?
              <input
                type="submit"
                value="Update"
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />

              :
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
            {
              editMode &&
              <button
                onClick={() => {
                  reset({ name: '', order: '' })
                  setEditMode(false)
                }}
                className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
              >Cancel</button>
            }
          </div>
        </div>
      </form> */}
      <div className="mx-4">
        <span>Category ({category.length})</span>
        <IconButton aria-label="new-category" color="secondary" onClick={handleOpen}>
          <AddBoxIcon />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CategoryForm
            onSubmit={handleCategoryFormSubmit}
            editData={editData}
            isEdit={isEdit}
            onCancel={handleClose}
          />
        </Modal>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={category}
          columns={columns}
        />
      </div>
    </main>
  );
}
