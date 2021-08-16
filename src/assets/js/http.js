import Axios from 'axios'
import router from '../../router/index'
import store from '../../store'

Axios.defaults.headers['Content-Type'] = "'Content-Type': 'multipart/form-data'";

export default {

  post(url, data) {
    var fd = new FormData();
    for (let key in data) {
      fd.append(key, data[key]);
    }
    return new Promise((resolve, reject) => {
      Axios.post(url, fd).then((response) => {
        resolve(response.data)
      }).catch((response) => {
        reject(response)
        console.log('false', response)
      })
    })
  },
  get(url) {
    return new Promise((resolve, reject) => {
      Axios.get(url,{headers:{Authorization: 'Bearer ' + store.state.token}}).then((response) => {
        resolve(response.data)
      }).catch((response) => {
        reject(response)
        console.log('f', response)
      })
    })
  },

  logout(url,data) {
    return new Promise((resolve, reject) => {
      Axios.post(url,data,{headers:{Authorization: 'Bearer ' + store.state.token}}).then((response) => {
        resolve(response.data)
      }).catch((response) => {
        reject(response)
        console.log('f', response)
      })
    })
  },

  getselectList(url,data) {
    var fd = new FormData();
    for (let key in data) {
      fd.append(key, data[key]);
    }
    return new Promise((resolve, reject) => {
      Axios.post(url,fd,{headers:{ Authorization: 'Bearer ' + store.state.token}}).then((response) => {
        resolve(response.data)
      }).catch((response) => {
        reject(response)
        console.log('f', response)
      })
    })
  },
}

Axios.interceptors.response.use(res=>{
  return res;
},err=>{
  console.log( '失敗', err )
})


