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
type Status = "pending" | "approved" | "rejected"
type UserId = string | any
type RequestId = string

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
  createUserMongoDB: (email: string | any) => Promise<any>
  fetchGenresByIds: (genreIds: string[]) => Promise<any>
  fetchInstrumentsByIds: (instrumentIds: string[]) => Promise<any>
  jammersFetchBySearch: (params: SearchText, pageNumber: any) => Promise<any>
  reportUser: (reportedUserId: any, userId: any, reason: string) => Promise<any>
  sendFriendRequest: (
    senderId: SenderId,
    receiverId: ReceiverId
  ) => Promise<any>
  respondToFriendRequest: (requestId: RequestId, status: Status) => Promise<any>
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
      console.error("Error retrieving friend requests by receiver ID:", error)
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
      console.error("Error retrieving friend requests by senderId ID:", error)
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
      console.error("Error retrieving friends by user ID:", error)
      throw error
    }
  },
}

export default dataAxios
