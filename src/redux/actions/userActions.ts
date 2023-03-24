import axios from 'axios'
import { Dispatch } from 'react'
import { BASE_URL } from '../../utils'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword, 
    sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential} from 'firebase/auth';
import { getFirestore, setDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';

export interface UserLoginAction{
    readonly type: 'ON_USER_LOGIN' | 'ON_USER_ERROR' | 'ON_USER_SIGN_UP' | 'ON_USER_SIGN_UP_FAILED',
    payload: object
}

export type UserAction = UserLoginAction;


export const OnUpdateUserData = (curUser: object, userId: string) => {
   
    return ( dispatch: Dispatch<UserAction>) => {
       
        try {            
            dispatch({
                type: 'ON_USER_LOGIN',
                payload: {
                    userId: userId,
                    curUser: curUser,
                    isLoggedIn: true,
                    finishIntro: true,
                }
            })     
            return true        

        } catch (error) {
           console.log(error)
            return false
        }
    }

}

export const OnUserLogin = (email: string, password: string) => {   
    return async ( dispatch: Dispatch<UserAction>) => {
        try {
        const auth = getAuth();
        let returnStatus = false
        let userData:any = await signInWithEmailAndPassword(auth, email, password);
        if(userData != null) {    
            const firestore = getFirestore();
            await getDoc(doc(firestore, "Users", userData.user?.uid))
            .then((user:any) => {  
                let curUser =  user.data();
                if(curUser) {
                    dispatch({
                        type: 'ON_USER_LOGIN',
                        payload: {
                            userId: userData.user?.uid,
                            curUser: curUser,
                            isLoggedIn: true,
                            finishIntro: true,
                        }
                    })
                    returnStatus = true
                }
            })               
            return returnStatus           
        } 
        else {
            return false;
        }
    }
    catch(e) {
        console.log(e)
    }
    }

}

export const OnUserSignup = (email: string, password: string) => {
    return async ( dispatch: Dispatch<UserAction>) => {

        try {
            const auth = getAuth();
            let userData =  await createUserWithEmailAndPassword(auth, email, password);
            let returnStatus = false
            if(userData != null) {
               const firestore = getFirestore();
               await setDoc(doc(firestore, "Users", userData.user?.uid), {
                    firstName: "",
                    lastName: "",
                    email: email,
                    isAdmin: false,
                    userType: 'free',
                    diffRatingVal: 16,
                    easyRatingVal: 24,
                    hardRatingVal: 6,
                })
                .then(() => {
                    const curUser = {
                        firstName: "",
                        lastName: "",
                        email: email,
                        isAdmin: false,
                        userType: 'free',
                        diffRatingVal: 16,
                        easyRatingVal: 24,
                        hardRatingVal: 6,
                    }
                    dispatch({
                        type: 'ON_USER_LOGIN',
                        payload: {
                            userId: userData.user?.uid,
                            curUser: curUser,
                            isLoggedIn: true,
                            finishIntro: false,
                        }
                    })
                    returnStatus = true
                })
                .catch((e) => {
                    dispatch({
                        type: 'ON_USER_ERROR',
                        payload: e.message
                    })    
                });
                
                
                return returnStatus
            } 
            else {
                return false
            }
        } catch (error) {
           console.log(error)
           return false
        }
    }
}


export const OnUserForgotPass = (email: string) => {
    return async () => {

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email)

           return true
        } catch (error) {
           console.log(error,"@@@@")
           return false
        }
    }
}

export const OnUserLoginWithCredential = (credential: any) => {   
    return async ( dispatch: Dispatch<UserAction>) => {
        const auth = getAuth();
        let returnStatus = false
        let userData:any =  await signInWithCredential(auth, credential)
        
        if(userData != null) {    
            const firestore = getFirestore();
            await getDoc(doc(firestore, "Users", userData.user?.uid))
            .then((user:any) => {  
                let curUser =  user.data();
                if(curUser) {
                    dispatch({
                        type: 'ON_USER_LOGIN',
                        payload: {
                            userId: userData.user?.uid,
                            curUser: curUser,
                            isLoggedIn: true,
                            finishIntro: true,
                        }
                    })
                    returnStatus = true
                }
            })   
            return returnStatus      
        } 
        else {
            return false;
        }
    }

}

export const OnUserSignupWithCredential = (userId: string, email: string, firstName: string, phoneNumber: string) => {
    return async ( dispatch: Dispatch<UserAction>) => {

        try {           
            const firestore = getFirestore();
            let returnStatus = false
            let userDetail:any = await getDoc(doc(firestore, "Users", userId))
            if(userDetail.data()) {
                return false
            }
            else {
                await setDoc(doc(firestore, "Users", userId), {
                    firstName: firstName,
                    lastName: "",
                    email: email,            
                    isAdmin: false,
                    userType: 'free',
                    diffRatingVal: 16,
                    easyRatingVal: 24,
                    hardRatingVal: 6,
                })
                .then(() => {
                    const curUser = {
                        firstName: firstName,
                        lastName: "",
                        email: email,            
                        isAdmin: false,
                        userType: 'free',
                        diffRatingVal: 16,
                        easyRatingVal: 24,
                        hardRatingVal: 6,
                    }
                    returnStatus = true
                    dispatch({
                        type: 'ON_USER_LOGIN',
                        payload: {
                            userId: userId,
                            curUser: curUser,
                            isLoggedIn: true,
                            finishIntro: false,
                        }
                    })
                })
                return returnStatus
            }
            
        } catch (error) {
           console.log(error)
           return false
        }
    }
}

export const OnuserLogout = () => {       

    return async ( dispatch: Dispatch<UserAction>) => {
        try {          

            dispatch({
                type: 'ON_USER_LOGIN',
                payload: {
                    userId: '',
                    curUser: null,
                    isLoggedIn: false,
                    finishIntro: false,
                }
            })
            
            return true
        } catch (error) {
           console.log(error)
           return false
        }
    }

}

export const FinishIntroSlider = (userId: string, curUser: object) => {
    return async ( dispatch: Dispatch<UserAction>) => {
        try {          

            dispatch({
                type: 'ON_USER_LOGIN',
                payload: {
                    userId: userId,
                    curUser: curUser,
                    isLoggedIn: true,
                    finishIntro: true,
                }
            })
            
            return true
        } catch (error) {
           console.log(error)
           return false
        }
    }

}