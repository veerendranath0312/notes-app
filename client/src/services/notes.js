import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/notes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (noteObj) => {
  const response = await axios.post(baseUrl, noteObj)
  return response.data
}

const update = async (id, noteObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, noteObj)
  return response.data
}

export default { getAll, create, update }
