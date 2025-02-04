import { Slot } from "expo-router";
import { LoginProvider } from "./contexts/loginContext";

export default function layout(){
    return (
       <LoginProvider>
         <Slot></Slot>
       </LoginProvider> 
    );
}