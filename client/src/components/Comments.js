/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./styles/Comments.css";
import { MdDelete } from "react-icons/md";
import { useStateValue } from "../context/StateProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import axios from "axios";

toast.configure();

function Comments({ comments, postId }) {
  const [, dispatch] = useStateValue();
  const [editText, setEditText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const errorNotify = (text) => {
    toast.error(text, { autoClose: 1500 });
  };

  const editComment = async (value, id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/post/${postId}/${id}`,
        {
          editText: value,
        },
        config
      );
      dispatch({
        type: "SET_COMMENTS",
        _id: postId,
        comments: data.comments,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to Edit the Comment.");
    }
  };

  const deleteComment = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.delete(`/api/post/${postId}/${id}`, config);
      dispatch({
        type: "SET_COMMENTS",
        _id: postId,
        comments: data.comments,
      });
      successNotify("Comment Deleted");
    } catch (error) {
      errorNotify("Something went wrong, unable to delete the Comment");
    }
  };
  return (
    <div className="comments">
      <h4>Comments:</h4>
      <div>
        {comments?.map((c_item) => (
          <div key={c_item?._id}>
            {c_item?.postedBy._id === user?._id ? (
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
                  <strong> {`${c_item?.postedBy.name}:`} </strong>
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
                <strong> {`${c_item?.postedBy.name}:`} </strong> {c_item?.text}
              </p>
            )}
            <div>
              {c_item?.postedBy._id === user?._id ? (
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
