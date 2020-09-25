export const initialState = null;

export const reducer = (state, action) => {
    if (action.type === 'USER') {
   
        return action.payload
    }
    if (action.type === 'CLEAR') {
        return null
    }
   
        if(action.type==="UPDATE"){
            console.log(action.payload)
            return {
                ...state,
                followers:action.payload.followers,
                followings:action.payload.followings
            }
        }    
        if(action.type==="SOCKET"){
            return {
                ...state,
                socket:action.payload
            }
        }    
    return state
}