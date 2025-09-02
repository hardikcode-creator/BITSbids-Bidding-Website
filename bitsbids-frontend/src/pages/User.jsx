import React, { useEffect } from "react";
import "./User.css"
export default function User({ user , onRemoveUser , onAddBalance}) {
  return (

    <div className="user-card">
      {/* Profile Image */}
      <div className="user-card__profile">
        {user.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={user.fullName}
            className="user-card__img"
          />
        ) : (
          <div className="user-card__placeholder">
            {user.fullName?.[0] || "U"}
          </div>
        )}
      </div>
   
      {/* User Info */}
      <div className="user-card__info">
        <h3 className="user-card__name">{user.fullName}</h3>
        <p className="user-card__email">Email: {user.email}</p>
        <p className="user-card__balance">Balance: ₹{user.balance}</p>
        <p className="user-card__created">
          Joined: {new Date(user.createdAt).toLocaleDateString("en-IN")}
        </p>
      </div>

      {/* Actions */}
      <div className="user-card__actions">
        <button
          className="user-card__button user-card__button--add"
        onClick={()=>onAddBalance(user.email,user.fullName)}
        >
          Add Balance
        </button>
        <button
          className="user-card__button user-card__button--remove"
          onClick={() => onRemoveUser(user.email)}
        >
          Remove User
        </button>
      </div>
      </div>

  );
}
