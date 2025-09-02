import styles from "./Login.module.css";
import {assets} from "../assets/frontend_assets/assets";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from "react";
import userService from "../api/user.service";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
const Login = () => {
    const location  = useLocation();
    const isLogin  = location.pathname === '/login';
    const email = useRef("");
    const password = useRef("");
    const fullName = useRef("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin=async(e)=>{    
        e.preventDefault();
        const data =  await userService.login(email.current.value,password.current.value);
        
        const userDetails = {
            fullName:data.user.fullName,
            email:data.user.email,
            profilePictureUrl:data.user.profilePictureUrl,
            role:data.user.role,
            balance:data.user.balance
        };
        dispatch(userActions.addUser(userDetails));
         toast.success("Login Successful");     
    setTimeout(() => {
        navigate("/");
    }, 1000); 

    }

    const handleRegister=async(e)=>{
        e.preventDefault();
        await userService.register({email:email.current.value,password:password.current.value,fullName:fullName.current.value});
        email.current.value = "";
        fullName.current.value = "";
        password.current.value="";
        toast.success("Activate the account and Login.");
       setTimeout(() => {
        navigate("/login");
    }, 1000); 
    }
  return (
    <div className={styles['login-container']}>
        <div className={styles['login-left']}>
        <img src={assets.logo} alt="Logo" className={styles['login-logo']}/>
        <h1 className={styles['login-heading']}> Discounted and Quality Items</h1>
        </div>
        <div className={styles['login-right']}>
          {isLogin?  <div className={styles['form-box']}>
                <h2>Login</h2>
                <form onSubmit={handleLogin} >
                    <div className={styles['input-group']}>
                        <label>Email</label>
                        <input type="email" placeholder='Enter your email' ref={email} ></input>
                    </div>
                    <div className={styles['input-group']}>
                        <label>Password</label>
                        <input type="password"  placeholder='Enter your password' ref={password} ></input>
                    </div>
                    <button className={styles['login-btn']} type="submit">Login</button>
                    <p className={styles['switch-link']}>
                        Dont have an account? <a href='/register' onClick={()=>setlogin(false)}>Register</a>
                    </p>
                </form>
            </div>
            :<div className={styles['form-box']}>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <div className={styles['input-group']}>
                        <label>Full Name</label>
                        <input  type="text" placeholder='Enter your name' ref={fullName}></input>
                    </div>
                    <div className={styles['input-group']}>
                        <label>Email</label>
                        <input type="email" placeholder='Enter your email'
                        ref={email}></input>
                    </div>
                    <div className={styles['input-group']}>
                        <label>Password</label>
                        <input  type="password" placeholder='Enter your password' ref={password}></input>
                    </div>
                    <button className={styles['login-btn']} type="submit">Register</button>
                    <p className={styles['switch-link']}>
                        Already have an account? <a href='/login'>Login</a>
                    </p>
                </form>
            </div>
                }
        </div>
    </div>
  )
}

export default Login