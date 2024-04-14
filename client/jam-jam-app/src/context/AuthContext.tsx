import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import {auth} from "../services/firebaseConfig"
import dataAxios from "../server/data.axios"

import {User as FirebaseUser} from "firebase/auth"

import {setUserDataMongoDB} from "../redux/reducers/UserDataSliceMongoDB"

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  UserCredential,
} from "firebase/auth"

import {useSelector, useDispatch} from "react-redux"
import {
  setFirebaseUserData,
  selectFirebaseUserData,
  clearFirebaseUserData,
} from "../redux/reducers/FirbaseUserDataSlice"
import {setFriendRequestsNumber} from "../redux/reducers/UserNotifications"

export interface AuthContextProps {
  currentUser: FirebaseUser | null
  login: (email: string, password: string) => Promise<UserCredential>
  signup: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateCurrentEmail: (email: string) => Promise<void>
  updateCurrentPassword: (newPassword: string) => Promise<void>
  reauthenticateCurrentWithCredential: (password: string) => Promise<void>
  sendCurrentEmailVerification: () => Promise<void>
  signInWithGoogle: () => Promise<UserCredential>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  // const [username, setUsername] = useState<string>("")

  // const userEmail = useSelector(
  //   (state: RootState) => state.userDataMongoDB.allUserData?.email
  // )

  const dispatch = useDispatch()
  const firebaseUserData = useSelector(selectFirebaseUserData)

  const signup = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const login = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // const login = async (
  //   email: string,
  //   password: string
  // ): Promise<UserCredential> => {
  //   const userCredential = await signInWithEmailAndPassword(
  //     auth,
  //     email,
  //     password
  //   )

  //   if (userCredential.user && userCredential.user.emailVerified) {
  //     return userCredential
  //   } else {
  //     throw new Error("Email not verified")
  //   }
  // }

  const logout = async (): Promise<void> => {
    return signOut(auth)
  }

  const resetPassword = async (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email)
  }

  const updateCurrentEmail = async (email: string): Promise<void> => {
    return updateEmail(auth.currentUser!, email) // Notice the non-null assertion here
  }

  const updateCurrentPassword = async (newPassword: string): Promise<void> => {
    return updatePassword(auth.currentUser!, newPassword) // Notice the non-null assertion here
  }

  const reauthenticateCurrentWithCredential = async (
    password: string
  ): Promise<any> => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser!.email!,
      password
    ) // Notice the non-null assertion here
    return reauthenticateWithCredential(auth.currentUser!, credential) // Notice the non-null assertion here
  }

  const sendCurrentEmailVerification = async (): Promise<void> => {
    return sendEmailVerification(auth.currentUser!) // Notice the non-null assertion here
  }

  const signInWithGoogle = async (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)

      if (user) {
        // If the user is logged in, check email verification status
        if (!user.emailVerified) {
          // User's email is not verified, handle accordingly
          console.log("Email not verified")
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const jammerCardFetch = async () => {
      try {
        // if (!userEmail) {
        //   const response = await dataAxios.createUserMongoDB(currentUser?.email)
        // }

        if (currentUser && currentUser.emailVerified) {
          const userData = await dataAxios.jemerCardDataFetchByEmail(
            currentUser.email
          )

          console.log("the fetch*****************************", userData)

          if (userData?.data.user) {
            dispatch(setUserDataMongoDB(userData.data.user))
          } else if (userData.data.user === null) {
            const responseCreateUser = await dataAxios.createUserMongoDB(
              currentUser.email
            )
            const responseFetchByEmail =
              await dataAxios.jemerCardDataFetchByEmail(currentUser.email)
            console.log(responseCreateUser)
            console.log(responseFetchByEmail)

            if (responseFetchByEmail.data.user) {
              dispatch(setUserDataMongoDB(responseFetchByEmail.data.user))
            }
          }

          // console.log(
          //   "initializationuser data  -----------",
          //   userData.user.userName
          // )
        } else {
          return
        }

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    jammerCardFetch()
  }, [currentUser, dispatch])

  const value: AuthContextProps = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateCurrentEmail,
    updateCurrentPassword,
    reauthenticateCurrentWithCredential,
    sendCurrentEmailVerification,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <p>Loading</p> : children}
    </AuthContext.Provider>
  )
}
