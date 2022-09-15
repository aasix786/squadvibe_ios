// base url set by 09-07-2021 = http://squadvibes.onismsolution.com/api/signUp

import  axios from 'axios';
export default axios.create({
    baseURL: 'http://squadvibes.onismsolution.com/api/',
    headers:{
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
    }
}); 


