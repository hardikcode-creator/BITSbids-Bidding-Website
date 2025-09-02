import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import styles from "./BasicPagination.module.css"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {sortActions} from "../store/sortSlice";
const BasicPagination = () => {
  const filters = useSelector((store)=>store.filters);
  const dispatch = useDispatch();

  const handleChange = (event, value) => {
    dispatch(sortActions.setPage(value-1));
  };
  return (

    <div className={styles['pagination']}>
    <Stack spacing={2}>
 
      <Pagination count={5} color="primary"
      onChange={handleChange} page={filters.pageNo+1}/>
    </Stack>
    </div>
  
  )
}

export default BasicPagination;