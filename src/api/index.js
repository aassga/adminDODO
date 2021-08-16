import { axios } from '../libs/axios/api.request'

//登录
export const login = data => {
  let postData = {
    url: '/login',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}

// 登出
export const logout = data => {
  let postData = {
    url:'/logout',
    method:'post',
    isForm:true,
    data
  }
  return axios.request(postData);
}

//更換引擎
export const setEngine = data => {
  const postData = {
    url:'/user/set_engine',
    method:'post',
    isForm:true,
    data
  }
  return axios.request(postData);
}

// 用户信息
export const getUserInfo = (params) => {
  let postData = {
    url: '/me',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 创建用户
export const register = data => {
  let postData = {
    url: '/register',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// AD列表
export const getAdList = (params) => {
  let postData = {
    url: '/ad/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 域名排行榜列表
export const getDomainList = (params) => {
  let postData = {
    url: '/domain_info/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 首页列表
export const getBaiduList = (params) => {
  let postData = {
    url: '/baidu/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 获取关键字列表
export const getKeyList = (params) => {
  let postData = {
    url: 'key/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 设置域名備註
export const setAdrankRemark = data => {
  let postData = {
    url: '/domain_info/remark',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}
// 设置廣告板備註
export const setDashboardRemark = data => {
  let postData = {
    url: '/ad/remark',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 设置关键字
export const setKey = data => {
  let postData = {
    url: '/key',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}
// 删除关键字
export const deleteKey = data => {
  console.log(data)
  let postData = {
    url: '/key/delete/multiple',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 编辑关键字
export const editKey = data => {
  let postData = {
    url: '/key/edit',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}
// 上传关键字
export const uploadKey = data => {
  let postData = {
    url: '/key/upload',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//获取用户列表
export const getUserList = (params) => {
  let postData = {
    url: '/user/list',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//添加新用户
export const addRegister = data => {
  let postData = {
    url: '/register',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}
//删除用户
export const delelteUser = data => {
  let postData = {
    url: '/user/delete',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//编辑用户
export const updateUser = data => {
  let postData = {
    url: '/user/update',
    method: 'post',
    isForm: true,
    data
  }
  return axios.request(postData)
}


