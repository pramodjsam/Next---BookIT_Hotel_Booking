import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import Link from "next/link";
import Loader from "../layout/Loader";
import {
  allUsers,
  clearErrors,
  deleteUser,
} from "../../redux/actions/userActions";
import { DELETE_USER_RESET } from "../../redux/constants/userConstants";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, error, loading } = useSelector((state) => state.allUsers);
  const { isDeleted, error: deleteUserError } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteUserError) {
      toast.error(deleteUserError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("User deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, error, deleteUserError, isDeleted]);

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "User ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    users &&
      users.forEach((user) => {
        data.rows.push({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          actions: (
            <>
              <Link href={`/admin/users/${user._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-pencil"></i>
                </a>
              </Link>

              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteUserHandler(user._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">{users && users.length} Users</h1>
          <MDBDataTable
            data={setUsers()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      )}
    </div>
  );
};

export default AllUsers;
