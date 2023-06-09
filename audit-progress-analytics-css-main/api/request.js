import axios from "axios";

export const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
  });

  request.interceptors.request.use(
    (config) => {
      return config;
    },
  error =>{
  console.log("🚀 ~ file: request.js ~ line 12 ~ error", error)
 
    Promise.reject(error)
  }

  )


  request.interceptors.response.use((response)=>{
    return response
  }, async function(error){


    //const dispatch=useDispatch()
    //console.log(error)
    const originalRequest = error.config;
    //if (error.response.status === 401 && !originalRequest._retry) {
     /*  originalRequest._retry = true;
      return request(originalRequest); */
     // return Promise.reject(error);
     /*
      const res = await refreshAccessToken();
      const access_token = res.data.token
      //originalRequest.headers['authorization'] = 'Bearer ' + access_token;
      //console.log(originalRequest)
      dispatch(storeUserData(access_token));
      */
    //}
    return Promise.reject(error);
  })
