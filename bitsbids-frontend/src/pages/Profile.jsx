import { useState } from "react";
import userService from "../api/user.service";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userSlice";
import styles from "./Profile.module.css";
import { assets } from "../assets/frontend_assets/assets";
function Profile() {
  const [file, setFile] = useState(null);
  const user  = useSelector((store)=>store.user);
  const dispatch  = useDispatch();
  const handleUpload = async () => {

   const data = await userService.uploadImage(file,user.fullName);
    dispatch(userActions.setProfilepic(data.imageUrl));
  };
  const profileImage = user?.profilePictureUrl|| assets.defaultProfile;
 return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "40px",
        padding: "30px 40px",
        backgroundColor: "#1e1e2f",
        borderRadius: "12px",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        width: "60%",
        margin: "200px auto",
      }}
    >
      {/* Left - Profile Image */}
      <div
  style={{
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    paddingTop: "20px",
  }}
>
  {profileImage ? (
    <img
      src={profileImage}
      alt="Profile"
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #4e9cff",
      }}
    />
  ) : (
    <div
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        border: "3px solid #4e9cff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        color: "#4e9cff",
        backgroundColor: "#2a2a3d",
      }}
    >
      Profile
    </div>
  )}

  <label
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      cursor: "pointer",
      color: "#ddd",
      fontSize: "0.9rem",
    }}
  >
    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      style={{
        display: "none", // hide ugly default
      }}
    />
    <span style={{ padding: "4px 8px", background: "#333", borderRadius: "4px" }}>
      Choose File
    </span>
    {file?.name && <span>{file.name}</span>}
  </label>

  <button
    onClick={handleUpload}
    style={{
      padding: "6px 16px",
      backgroundColor: "#4e9cff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Upload
  </button>
</div>


      {/* Right - User Info */}
      <div style={{ flex: 1, marginLeft:"100px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "8px", color: "#4e9cff"}}>
          {user?.fullName || "User"}
        </h2>
        <p style={{ marginBottom: "6px", fontWeight: "bold" }}>
          {user?.role || "No role"}
        </p>
        <p style={{ opacity: 0.8 }}>{user?.email || "No email"}</p>
      </div>
    </div>
  );
}

export default Profile;