import axios, {AxiosError} from "axios"

interface Params {
  country: string | null
  region: string | null
  city: string | null
  isoCode: string | null
  genres: Array<string>
  instruments: Array<string>
}

interface SearchText {
  username: string | null
}

const dataAxios: {
  dataFetch: (pageNumber: any) => Promise<any>
  jammersFetchFiltered: (params: Params, pageNumber: any) => Promise<any>
  genresFetch: () => Promise<any>
  instrumentsFetch: () => Promise<any>
  jemerCardDataFetch: (id: any) => Promise<any>
  jemerCardDataFetchByEmail: (id: any) => Promise<any>
  usernamesDataFetch: () => Promise<any>
  userDataFetch: () => Promise<any>
  userCardDataUpdate: (id: any, payload: object) => Promise<any>
  createUserMongoDB: (email: string) => Promise<any>
  fetchGenresByIds: (genreIds: string[]) => Promise<any>
  fetchInstrumentsByIds: (instrumentIds: string[]) => Promise<any>
  jammersFetchBySearch: (params: SearchText, pageNumber: any) => Promise<any>
} = {
  dataFetch: async (pageNumber) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/getallusers?page=${pageNumber}`
      )
      return data
    } catch (err) {
      console.log(err)
    }
  },
  genresFetch: async () => {
    try {
      const {data} = await axios.get(`http://localhost:3500/genres`)

      return data
    } catch (err) {
      console.log(err)
    }
  },
  instrumentsFetch: async () => {
    try {
      const {data} = await axios.get(`http://localhost:3500/instruments`)

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
  usernamesDataFetch: async () => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/getjemerusernames/`
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

  jammersFetchFiltered: async (params, pageNumber) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/jammersfetchfiltered?page=${pageNumber}`,
        {params}
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },

  jammersFetchBySearch: async (params, pageNumber) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/users/jammersfetchbysearch?page=${pageNumber}`,
        {params}
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
  fetchGenresByIds: async (genreIds) => {
    try {
      const {data} = await axios.patch(
        `http://localhost:3500/genres/getgenresbyids`,
        {genreIds}
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },
  fetchInstrumentsByIds: async (instrumentIds) => {
    try {
      const {data} = await axios.patch(
        `http://localhost:3500/instruments/getinstrumentsbyids`,
        {instrumentIds}
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },
}

export default dataAxios
