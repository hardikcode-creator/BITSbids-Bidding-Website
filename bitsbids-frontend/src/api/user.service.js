import { toast } from "react-toastify";
import app from "./tokenanderror.service";
const API_URL = "http://localhost:9010"; 
 const login = async (email, password) => {
  try {
    const { data } = await app.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
     const message = error?.response?.data?.message?error.response.data.message:"Something went wrong";
      toast.error(message);
    throw error;
  }
};

const register = async(user)=>{
    try{
        console.log(user);
        const {data} = await app.post(`${API_URL}/register`,user);
        return data;
    }
    catch(error){

      const message = error?.response?.data?.message?error.response.data.message:"Something went wrong";
      toast.error(message);
        throw error;
    }
};

const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out");
}
const uploadImage=async(file,fullName)=>{

  try{
  const formData = new FormData();
  formData.append("file",file);
  const {data} = await app.post(API_URL+"/profileupload/"+fullName,formData,

  {headers:{"Content-Type":"multipart/form-data"}}

  );
   toast.success("Profile Pic Updated");  
   return data;
  }
  catch(error)
  {
    
    const message = error?.response?.data?.message?error.response.data.message:"Error Uploading Image";
      toast.error(message);
        throw error;

  }
}
const userService = {
    login,register,logout,uploadImage
}

export default userService;