import React, { useState } from "react";
import "./styles/Comments.css";
import { MdDelete } from "react-icons/md";
import { useStateValue } from "../context/StateProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";

toast.configure();

function Comments({ comments, postId }) {
  const [, dispatch] = useStateValue();
  const [editText, setEditText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const warnNotify = (text) => {
    toast.warn(text);
  };

  const editComment = (value, id) => {
    fetch("/editComment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        cID: id,
        editText: value,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //Comment Added
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
      })
      .catch((err) => {
        console.log(err);
        warnNotify("Something went wrong");
      });
  };

  const deleteComment = (id) => {
    fetch("/deleteComment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        cID: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //Comment Added
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
        successNotify("Comment Deleted");
      })
      .catch((err) => {
        console.log(err);
        warnNotify("Something went wrong");
      });
  };
  return (
    <div className="comments">
      <h4>Comments:</h4>
      <div>
        {comments?.map((c_item) => (
          <div key={c_item?._id}>
            {c_item?.postedBy === user?._id ? (
              <div
                style={{
                  width: "40rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    width: "8rem",
                    display: "inline-block",
                    marginBottom: "0.6rem",
                  }}
                >
                  <strong> {`${c_item?.c_name}:`} </strong>
                </p>
                <EditText
                  style={{ height: "0.5rem" }}
                  defaultValue={c_item?.text}
                  onEditMode={() => {
                    setEditText(c_item?.text);
                  }}
                  inline={true}
                  onSave={(res) => {
                    editComment(res.value, c_item?._id);
                  }}
                />
              </div>
            ) : (
              <p>
                <strong> {`${c_item?.c_name}:`} </strong> {c_item?.text}
              </p>
            )}
            <div>
              {c_item?.postedBy === user?._id ? (
                <MdDelete
                  onClick={() => {
                    deleteComment(c_item?._id);
                  }}
                  className="comment_delete_icon"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
