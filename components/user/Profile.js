import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { clearErrors, updateProfile } from "../../redux/actions/userActions";
import ButtonLoader from "../layout/ButtonLoader";
import { UPDATE_PROFILE_RESET } from "../../redux/constants/userConstants";
import Loader from "../layout/Loader";

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );

  const { user: loadedUser, loading } = useSelector((state) => state.loadUser);
  const {
    loading: updateLoading,
    isUpdated,
    error,
  } = useSelector((state) => state.user);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email, password, avatar };
    dispatch(updateProfile(userData));
  };

  const onChangeHandler = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (loadedUser) {
      setUser({
        name: loadedUser.name,
        email: loadedUser.email,
      });
      setAvatarPreview(loadedUser.avatar.url);
    }
  }, [loadedUser]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      router.push("/");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, isUpdated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <img
                          src={avatarPreview}
                          className="rounded-circle"
                          alt="image"
                        />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="avatar"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChangeHandler}
                        accept="images/*"
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={updateLoading ? true : false}
                >
                  {updateLoading ? <ButtonLoader /> : "UPDATE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
