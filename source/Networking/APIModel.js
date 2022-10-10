
import  axios from 'axios';

axios.defaults.baseURL = 'http://squadvibes.onismsolution.com/api/'


export const postMethod = (navigation,apiName,parameter,success,failure)  => {

  const header = {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json',
  }

  console.log("apiName ",apiName);
  console.log("parameter ",parameter);
  
  
  axios.post(apiName,parameter,{headers:header})
  .then(response => {
    console.log("API NAME IS  >>> ",apiName)
    if (response.data.status == 'SUCCESS') {
      success(response.data)
    } else {
      failure(response.data)
      console.error(response.data);
      if(response.data.is_token_expired && Boolean(response.data.is_token_expired)){
        failure(response.data)
        // resetStackAndNavigate(navigation,'Login');
      } else {
        failure(response.data);
      }
    }
  }).catch(error => {
    console.error("error in API Model",apiName,error);
    failure(error);
  })
}