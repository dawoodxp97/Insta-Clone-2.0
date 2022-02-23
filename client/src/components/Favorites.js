import React from "react";
import { useStateValue } from "../context/StateProvider";
import "./styles/Favorites.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

toast.configure();

function Favorites() {
  const [{ userDetails }] = useStateValue();
  return (
    <div className="fav_grp">
      <h2>Favorites</h2>
      {userDetails.favorites?.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "90vh",
            width: "80%",
          }}
        >
          <p>No Favorites Added</p>
        </div>
      ) : (
        <div className="favs">
          <div className="fav_main">
            {userDetails.favorites &&
              userDetails.favorites.map((item) => (
                <Link
                  style={{
                    textDecoration: "none",
                    color: "#121212",
                  }}
                  to={`/postDetails/${item?._id}`}
                >
                  <div key={item?._id} className="fav_img_grp">
                    <img
                      className="fav_img"
                      src={item?.photo}
                      alt={item?.message}
                    />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
