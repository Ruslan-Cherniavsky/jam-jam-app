import axios, {AxiosError} from "axios"

interface Params {
  country: string | null
  region: string | null
  city: string | null
  isoCode: string | null
  genres: Array<string>
  instruments: Array<string>
}

type SenderId = string
type ReceiverId = string
type JamId = string
type InstrumentId = string

type Status = "pending" | "approved" | "rejected"
type UserId = string | any
type RequestId = string

interface SearchText {
  username: string | null
}
interface SearchText {
  jamName: string | null
}

interface ExistingJamRequests {
  _id: string
  jamId: string
  instrumentId: string
  senderId: string
  receiverId: string
  status: string
  __v: number
}

const dataAxios: {
  dataFetch: (pageNumber: any) => Promise<any>
  getAllJamInvites: (params: any, pageNumber: any) => Promise<any>
  jemCardDataFetch: (id: any) => Promise<any>
  respondToJamRequest: (requestId: string, status: string) => Promise<any>
  getAllJamsPaginate: (pageNumber: any) => Promise<any>
  getAllFilteredJamsPaginate: (params: Params, pageNumber: any) => Promise<any>
  deleteJammerFromJamByIds: (
    senderId: string,
    receiverId: ReceiverId,
    jamId: JamId,
    instrumentId: InstrumentId
  ) => Promise<any>
  getAllJamsPaginateBySearch: (params: Params, pageNumber: any) => Promise<any>
  jammersFetchFiltered: (params: SearchText, pageNumber: any) => Promise<any>
  genresFetch: () => Promise<any>
  instrumentsFetch: () => Promise<any>
  jemerCardDataFetch: (id: any) => Promise<any>
  jemerCardDataFetchByEmail: (id: any) => Promise<any>
  usernamesDataFetch: () => Promise<any>
  userDataFetch: () => Promise<any>
  userCardDataUpdate: (id: any, payload: object) => Promise<any>
  createJam: (jam: object) => Promise<any>
  getAllJamsByJammerId: (userId: any, pageNumber: any) => Promise<any>
  createUserMongoDB: (email: string | any) => Promise<any>
  fetchGenresByIds: (genreIds: string[]) => Promise<any>
  fetchInstrumentsByIds: (instrumentIds: string[]) => Promise<any>
  jammersFetchBySearch: (params: SearchText, pageNumber: any) => Promise<any>
  reportUser: (reportedUserId: any, userId: any, reason: string) => Promise<any>
  sendFriendRequest: (
    senderId: SenderId,
    receiverId: ReceiverId
  ) => Promise<any>
  sendJamRequest: (
    senderId: SenderId,
    receiverId: ReceiverId,
    jamId: JamId,
    instrumentId: InstrumentId
  ) => Promise<any>

  respondToFriendRequest: (requestId: RequestId, status: Status) => Promise<any>
  getalljamrequestsbyids: (params: any) => Promise<any>
  getAllFriendRequestsByReceiverId: (receiverId: ReceiverId) => Promise<any>
  getAllFriendRequestsByReceiverIdPaginate: (
    receiverId: ReceiverId,
    pageNumber: any
  ) => Promise<any>
  getAllFriendRequestsBySenderIdPaginate: (
    receiverId: ReceiverId,
    pageNumber: any
  ) => Promise<any>
  getAllFriendRequestsBySenderId: (senderId: SenderId) => Promise<any>
  getAllFriendsByUserIdPaginate: (
    userId: UserId,
    pageNumber: any
  ) => Promise<any>
  deleteFriend: (userId: string, friendId: string) => Promise<any>
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
      const data = await axios.get(
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
  reportUser: async (reportedUserId, userId, reason) => {
    try {
      const data = await axios.post(`http://localhost:3500/users/reportuser`, {
        reportedUserId,
        userId,
        reason,
      })

      return data
    } catch (err) {
      console.log(err)
    }
  },

  sendFriendRequest: async (senderId, receiverId) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/friends/sendFriendRequest",
        {senderId, receiverId}
      )
      return response
    } catch (error) {
      console.error("Error sending friend request:", error)
      throw error
    }
  },
  deleteFriend: async (userId, friendId) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/friends/deleteFriend",
        {userId, friendId}
      )
      return response
    } catch (error) {
      console.error("Error sending friend request:", error)
      throw error
    }
  },
  respondToFriendRequest: async (requestId, status) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/friends/respondToFriendRequest",
        {requestId, status}
      )
      return response
    } catch (error) {
      console.error("Error responding to friend request:", error)
      throw error
    }
  },
  getAllFriendRequestsByReceiverId: async (receiverId) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/friends/getAllFriendRequestsByReceiverId/${receiverId}`
      )
      return response.data
    } catch (error) {
      console.error("Error retrieving friend requests by receiver ID:", error)
      throw error
    }
  },
  getAllFriendRequestsByReceiverIdPaginate: async (receiverId, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/friends/getAllFriendRequestsByReceiverIdPaginate/${receiverId}?page=${pageNumber}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getAllFriendRequestsBySenderId: async (senderId) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/friends/getAllFriendRequestsBySenderId/${senderId}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getAllFriendRequestsBySenderIdPaginate: async (senderId, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/friends/getAllFriendRequestsBySenderIdPaginate/${senderId}?page=${pageNumber}`
      )
      return response.data
    } catch (error) {
      console.error("Error retrieving friend requests by senderId ID:", error)
      throw error
    }
  },
  getAllFriendsByUserIdPaginate: async (userId, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/friends/getAllFriendsByUserIdPaginate/${userId}?page=${pageNumber}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  //---------------------james

  getAllJamsPaginate: async (pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/jams/getalljams-paginate?page=${pageNumber}`
      )
      return response.data
    } catch (error) {
      console.error("Error retrieving friends by user ID:", error)
      throw error
    }
  },
  getAllFilteredJamsPaginate: async (params, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/jams/getalljams-paginate-filtered?page=${pageNumber}`,
        {params}
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  getAllJamsPaginateBySearch: async (params, pageNumber) => {
    console.log(params)
    try {
      const response = await axios.get(
        `http://localhost:3500/jams/getjambyjamname?page=${pageNumber}`,
        {params}
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  jemCardDataFetch: async (id) => {
    try {
      const {data} = await axios.get(
        `http://localhost:3500/jams/getjambyid/${id}`
      )

      return data
    } catch (err) {
      console.log(err)
    }
  },

  deleteJammerFromJamByIds: async (
    senderId,
    receiverId,
    jamId,
    instrumentId
  ) => {
    try {
      const response = await axios.patch(
        `http://localhost:3500/jams/deletejammerfromjambyIds`,
        {senderId, receiverId, jamId, instrumentId}
      )
      return response
    } catch (error) {
      console.error("Error retrieving Jam requests by sender ID:", error)
      throw error
    }
  },
  //------jam Requests
  getalljamrequestsbyids: async (params) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/jamrequests/getalljamrequestsbyids`,
        {params}
      )
      return response.data
    } catch (error) {
      console.error("Error retrieving Jam requests by sender ID:", error)
      throw error
    }
  },

  sendJamRequest: async (senderId, receiverId, jamId, instrumentId) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/jamrequests/sendjamrequest",
        {senderId, receiverId, jamId, instrumentId}
      )
      return response
    } catch (error) {
      console.error("Error sending friend request:", error)
      throw error
    }
  },
  getAllJamsByJammerId: async (userId, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/jams/getjambyjammerid/${userId}?page=${pageNumber}`
      )
      return response
    } catch (error) {
      console.error("Error sending friend request:", error)
      throw error
    }
  },
  getAllJamInvites: async (params, pageNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3500/jamrequests/getalljamrequestsbyreceiveridpaginate?page=${pageNumber}`,
        {params}
      )
      return response
    } catch (error) {
      console.error("Error getting jam invites:", error)
      throw error
    }
  },
  respondToJamRequest: async (requestId, status) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/jamrequests/respondtojamrequest",
        {requestId, status}
      )
      return response
    } catch (error) {
      console.error("Error responding jam invites:", error)
      throw error
    }
  },
  createJam: async (jam) => {
    try {
      const response = await axios.post(
        "http://localhost:3500/jams/create",
        jam
      )
      return response
    } catch (error) {
      console.error("Error responding jam invites:", error)
      throw error
    }
  },
}

export default dataAxios
