import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearErrors } from "../redux/actions/roomActions";
import Pagination from "react-js-pagination";
import RoomItem from "./room/RoomItem";
import { useRouter } from "next/router";
import Link from "next/link";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  let { page = 1, location } = router.query;
  page = Number(page);
  const { rooms, roomsCount, resPerPage, filteredRoomsCount, error } =
    useSelector((state) => state.allRooms);

  const handlePagination = (currentPage) => {
    window.location.href = `/?page=${currentPage}`;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, []);

  let count = roomsCount;
  if (location) {
    count = filteredRoomsCount;
  }

  return (
    <>
      <section id="rooms" className="container mt-5">
        <h2 className="mb-3 ml-2 stays-heading">
          {location ? `Rooms in ${location}` : "All Rooms"}
        </h2>

        <Link href="/search">
          <a className="ml-2 back-to-search">
            <i className="fa fa-arrow-left"></i> Back to Search
          </a>
        </Link>
        <div className="row">
          {rooms && rooms.length === 0 ? (
            <div className="alert alert-danger mt-5 w-100">No Rooms Found</div>
          ) : (
            rooms &&
            rooms.map((room) => <RoomItem key={room._id} room={room} />)
          )}
        </div>
      </section>
      {resPerPage < count && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={page}
            totalItemsCount={roomsCount}
            itemsCountPerPage={resPerPage}
            onChange={handlePagination}
            nextPageText={"Next"}
            prevPageText={"Prev"}
            firstPageText={"First"}
            LastPageText={"Last"}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
};

export default Home;
