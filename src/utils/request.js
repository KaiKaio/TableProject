/**
 * 接口请求工具二次封装
 */

import axios from 'axios'

let creator = {
  timeout: 20000
}

if (process.env.NODE_ENV === 'production') {
  creator = {
    creator,
    ...{
      baseURL: process.env.BASE_URL
    }
  }
}
const service = axios.create(creator)

service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    let res = response.data

    return res
  },
  error => {
    return Promise.resolve(error)
  }
)

export default service
