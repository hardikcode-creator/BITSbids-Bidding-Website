import axios from "axios";
import {toast} from "react-toastify"

const app = axios.create({
    baseURL:"http://localhost:9010",
})

app.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");
        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
);

app.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response)
        {
        
            
        if (error?.response?.data?.error ==="token_expired") {
                 toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                 setTimeout(()=>{window.location.href="/login"},1000);
            }
          
        }
        return Promise.reject(error);
    }
);

export default app;