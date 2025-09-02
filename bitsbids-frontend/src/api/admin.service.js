import app from "./tokenanderror.service";
const APP_URI = "http://localhost:9010";

const getAllUsers= async()=>{
    return await app.get(APP_URI+"/admin/getAllUsers");
}
const addItem = async(formData)=>{
    return await app.post(APP_URI+"/admin/addItem",formData,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    });
}
const deleteUser = async(email)=>{
    return  await app.delete(APP_URI+"/admin/deleteUser/"+email);

}

const addBalance = async(email,amount)=>{
    return await app.put(APP_URI+"/admin/addBalance/"+email+"/"+amount);
}


const AdminService = {
    getAllUsers,
    addItem,
    deleteUser,
    addBalance
};
export default AdminService;