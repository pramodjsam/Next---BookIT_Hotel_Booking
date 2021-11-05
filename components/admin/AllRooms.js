import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import {
  clearErrors,
  deleteRoom,
  getAdminRooms,
} from "../../redux/actions/roomActions";
import Loader from "../layout/Loader";
import { useRouter } from "next/router";
import { DELETE_ROOM_RESET } from "../../redux/constants/roomConstants";

const AllRooms = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { rooms, error, loading } = useSelector((state) => state.allRooms);
  const { error: deleteRoomError, isDeleted } = useSelector(
    (state) => state.deleteRoom
  );

  useEffect(() => {
    dispatch(getAdminRooms());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteRoomError) {
      toast.error(deleteRoomError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Room deleted successfully");
      dispatch({ type: DELETE_ROOM_RESET });
    }
  }, [dispatch, error, isDeleted, deleteRoomError]);

  const setRooms = () => {
    const data = {
      columns: [
        {
          label: "Room ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price / Night",
          field: "price",
          sort: "asc",
        },
        {
          label: "Category",
          field: "category",
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

    rooms &&
      rooms.forEach((room) => {
        data.rows.push({
          id: room._id,
          name: room.name,
          price: room.pricePerNight,
          category: room.category,
          actions: (
            <>
              <Link href={`/admin/rooms/${room._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-pencil"></i>
                </a>
              </Link>
              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteRoomHandler(room._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteRoomHandler = (id) => {
    dispatch(deleteRoom(id));
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">
            {rooms && rooms.length} Rooms
            <Link href="/admin/rooms/new">
              <a className="mt-0 btn float-right text-white new-room-btn">
                Create Room
              </a>
            </Link>
          </h1>
          <MDBDataTable
            data={setRooms()}
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

export default AllRooms;
