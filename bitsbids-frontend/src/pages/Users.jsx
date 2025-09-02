import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import styles from "./Users.module.css";
import Footer from '../components/Footer';
import AdminService from '../api/admin.service';
import User from './User';
import { toast } from 'react-toastify';
import AddBalanceDialog from '../components/AddBalanceDialog';
const Users = () => {

    const [users,setUsers] = useState([]);
    const [isOpen,setisOpen] = useState(false);
    const [email,setEmail] = useState("");
    const [fullName,setfullName] = useState("");
    useEffect(()=>{

        fetchUsers();

    },[]);

    const fetchUsers=async()=>{
        
        const {data} = await  AdminService.getAllUsers();
       setUsers(data.users);
        
    }
    const onAddBalance=(email,fullName)=>{
        setisOpen(true);
        setEmail(email);
        setfullName(fullName);
    }
    const onRemoveUser=async(email)=>{
        try{

            await AdminService.deleteUser(email);
            fetchUsers();
            toast.success("User Removed Successfully")
        }
        catch(e)
        {
            toast.error("Error Removing User: "+e.getMessage());
        }
    }

      
  return (
    <>
    <Navbar/>
    <div className={styles['users-container']}>
        {
            users.map((user,idx)=>{
                return <User  key={idx} user={user} onRemoveUser={onRemoveUser} onAddBalance={onAddBalance}/>
            })
        }
    </div>
    <AddBalanceDialog isOpen={isOpen} setIsOpen={setisOpen} email={email} fullName={fullName} fetchUsers={fetchUsers} />
    <Footer/>
    </>
  )
}

export default Users