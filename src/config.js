import axios from 'axios'

export const selectMenuConfig = {
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  }
}

export const BASE_URL = `//somecoolproject.com/api`
export const appName = `myproject`

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})
