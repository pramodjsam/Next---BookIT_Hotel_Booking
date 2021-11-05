import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import easyinvoice from "easyinvoice";
import Link from "next/link";
import {
  adminBookings,
  clearErrors,
  deleteBooking,
} from "../../redux/actions/bookingActions";
import Loader from "../layout/Loader";
import { DELETE_BOOKING_RESET } from "../../redux/constants/bookingConstants";

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, error, loading } = useSelector(
    (state) => state.adminBookings
  );
  const { isDeleted, error: deleteBookingError } = useSelector(
    (state) => state.deleteBooking
  );

  useEffect(() => {
    dispatch(adminBookings());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteBookingError) {
      toast.error(deleteBookingError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      dispatch({ type: DELETE_BOOKING_RESET });
    }
  }, [dispatch, error, deleteBookingError, isDeleted]);

  const setBookings = () => {
    const data = {
      columns: [
        {
          label: "Booking ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Check In",
          field: "checkIn",
          sort: "asc",
        },
        {
          label: "Check Out",
          field: "checkOut",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amount",
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

    bookings &&
      bookings.forEach((booking) => {
        data.rows.push({
          id: booking._id,
          checkIn: new Date(booking.checkInDate).toLocaleDateString("en-US"),
          checkOut: new Date(booking.checkOutDate).toLocaleDateString("en-US"),
          amount: `$${booking.amountPaid}`,
          actions: (
            <>
              <Link href={`/admin/bookings/${booking._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-eye"></i>
                </a>
              </Link>

              <button
                className="btn btn-success mx-2"
                onClick={() => downloadInvoice(booking)}
              >
                <i className="fa fa-download"></i>
              </button>

              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteBookingHandler(booking._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteBookingHandler = (id) => {
    dispatch(deleteBooking(id));
  };

  const downloadInvoice = async (booking) => {
    var data = {
      documentTitle: "BookIT INVOICE", //Defaults to INVOICE
      //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
      currency: "USD", //See documentation 'Locales and Currency' for more info
      taxNotation: "vat", //or gst
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      logo: "https://res.cloudinary.com/bookit/image/upload/v1617904918/bookit/bookit_logo_cbgjzv.png", //or base64
      // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
      sender: {
        company: `Book IT`,
        address: `15th Street, 14 W 15th St`,
        zip: "10001",
        city: "New York",
        country: "United States",
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
      },
      client: {
        company: `${booking.user.name}`,
        address: `${booking.user.email}`,
        zip: "",
        city: `Check In: ${new Date(booking.checkInDate).toLocaleDateString(
          "en-US"
        )}`,
        country: `Check Out: ${new Date(
          booking.checkOutDate
        ).toLocaleDateString("en-US")}`,
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
      },
      invoiceNumber: `${booking._id}`,
      invoiceDate: `${new Date(Date.now()).toLocaleDateString("en-US")}`,
      products: [
        {
          quantity: `${booking.daysOfStay}`,
          description: `${booking.room.name}`,
          tax: 0,
          price: `${booking.amountPaid}`,
        },
      ],
      bottomNotice: "This is auto generated invoice of your booking on BookIT",
      //Used for translating the headers to your preferred language
      //Defaults to English. Below example is translated to Dutch
      // "translate": {
      //     "invoiceNumber": "Factuurnummer",
      //     "invoiceDate": "Factuurdatum",
      //     "products": "Producten",
      //     "quantity": "Aantal",
      //     "price": "Prijs",
      //     "subtotal": "Subtotaal",
      //     "total": "Totaal"
      // }
    };

    const result = await easyinvoice.createInvoice(data);
    easyinvoice.download(`invoice_${booking._id}.pdf`, result.pdf);
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5">{bookings && bookings.length} Bookings</h1>
          <MDBDataTable
            data={setBookings()}
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

export default AllBookings;
