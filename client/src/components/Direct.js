import React, { useState } from "react";
import "./styles/Direct.css";
function Direct() {
  const [msg, setMsg] = useState("");
  return (
    <div className="direct_content">
      <div className="direct_grp">
        <h2>Direct Messages</h2>
        <div className="chat_users">
          <div className="chat_user">A</div>
          <div className="chat_user">B</div>
          <div className="chat_user">C</div>
          <div className="chat_user">D</div>
          <div className="chat_user">A</div>
        </div>
        <div className="chat_body">
          <div className="chat_item">
            <p className="chat_receiver">THis is mesg</p>
          </div>
          <div className="chat_item">
            <p>THis is mesg</p>
          </div>
          <div className="chat_item">
            <p className="chat_receiver">THis is mesg</p>
          </div>
          <div className="chat_item">
            <p>THis is mesg</p>
          </div>
        </div>
        <div className="inp_grp">
          <form>
            <input
              placeholder="Start typing"
              value={msg}
              type="text"
              required
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Direct;
