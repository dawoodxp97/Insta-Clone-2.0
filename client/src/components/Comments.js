import React from "react";
import "./styles/Comments.css";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useStateValue } from "../context/StateProvider";
function Comments({ comments, postedUser }) {
  const [{ user }] = useStateValue();
  return (
    <div className="comments">
      <h4>Comments:</h4>
      <div>
        {comments?.map((c_item) => (
          <div key={c_item?._id}>
            <p>
              <strong> {`${c_item?.c_name}:`} </strong> {c_item?.text}
            </p>
            <div>
              {c_item?.postedBy === user?._id ? (
                <FiEdit className="comment_edit_icon" />
              ) : (
                ""
              )}
              {c_item?.postedBy === user?._id ? (
                <MdDelete className="comment_delete_icon" />
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
