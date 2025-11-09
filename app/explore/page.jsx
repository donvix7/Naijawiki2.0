import CustomFooter from '@/components/customFooter'
import FilterForm from '@/components/filterForm';
import CustomNavbar from '@/components/navBar'
import React from 'react'

const getWords = async () => {
     try {
       const res = await fetch("http://wiki-server.giguild.com/api/user/word/list");

        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        return res.josn();
    } catch (error) {
        console.log(error)

    }  
}
export default async function page() {
         words = await getWords();
   
  return (
    <div>
        <CustomNavbar />
        <FilterForm words={words} />
    <CustomFooter/>
     </div>
  );
}

