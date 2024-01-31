import axios, {AxiosError} from "axios"

const dataAxios: {
  dataFetch: () => Promise<any>
  jemerCardDataFetch: (id: any) => Promise<any>
  jemerCardDataFetchByEmail: (id: any) => Promise<any>
  userDataFetch: () => Promise<any>
  userCardDataUpdate: (id: any, payload: object) => Promise<any>
  createUserMongoDB: (email: string) => Promise<any>
} = {
  dataFetch: async () => {
    try {
      const {data} = await axios.get(`http://localhost:3500/users/getallusers`)

      return data
    } catch (err) {
      console.log(err)
    }
  },
  jemerCardDataFetch: async (id) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/getjemercarddatabyid/${id}`
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },
  jemerCardDataFetchByEmail: async (email) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/getjemercarddatabyemail/${email}`
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },

  userCardDataUpdate: async (id, payload) => {
    try {
      const {data} = await axios.patch(
        `http://localhost:3500/users/patchuserbyid/${id}`,
        payload
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },
  userDataFetch: async () => {
    try {
      const {data} = await axios.get(`http://localhost:3500/usercheck`)

      return data
    } catch (err) {
      console.log(err)
    }
  },

  createUserMongoDB: async (email) => {
    const payload = {
      email,
    }
    try {
      const {data} = await axios.post(
        `http://localhost:3500/users/signup`,
        payload
      )
      return data
    } catch (err) {
      console.log(err)
    }
  },
}

export default dataAxios
