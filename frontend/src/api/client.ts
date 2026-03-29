import axios from 'axios'

/**
 * API Client
 */

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

export default client