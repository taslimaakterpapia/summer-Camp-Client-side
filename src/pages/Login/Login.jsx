import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../providers/AuthProvider';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import {  FaGoogle } from "react-icons/fa";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { saveUser } from '../../api/AuthApi';
import Swal from 'sweetalert2';
import { app } from '../../firebase/firebase.config';


const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signIn } = useContext(AuthContext);
    const auth=getAuth(app);
    const provider=new GoogleAuthProvider()
    const navigate = useNavigate();
  
     const location = useLocation();
    console.log("login page location", location);
    const from = location.state?.from?.pathname || '/'
  

    const onSubmit = data => {
        console.log(data)
        signIn(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                saveUser(loggedUser)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User logged in successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(from, { replace: true })
            })
            .catch(error => {
                console.log(error);
            })
        };
        const handleGoogleSignIn=()=>{
            signInWithPopup(auth,provider)
            .then(result=>{
              const user=result.user;
              console.log(user);
              saveUser(user);
              Swal.fire({
                title: 'Custom animation with Animate.css',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
           
              navigate(from,{replace:true})
            })
            .catch(error=>{
              console.log(error.message);
            })
          }
    
    return (
        <div className="hero min-h-screen bg-gray-400 flex">
            
            <div className="hero-content flex-col lg:flex-row-reverse">
                
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white">
                    <form  onSubmit={handleSubmit(onSubmit)} className="card-body bg-sky-100 w-96 rounded-t-lg rounded-b-md">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" {...register("email")} placeholder="email" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" {...register("password")} placeholder="password" className="input input-bordered" />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
                        </div>
                    </form>
                    <p className='my-4 text-center'>New to Sports Club? <Link className='text-orange-600 font-bold' to='/signup'>Sign Up</Link></p>
                    <button onClick={handleGoogleSignIn} className="btn btn-circle bg-blue-500  mx-auto">
                            
                            <FaGoogle className='text-center text-cyan-600'></FaGoogle>
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Login;