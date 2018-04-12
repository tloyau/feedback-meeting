import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://144.254.51.227:15140/api/'
  })
}
