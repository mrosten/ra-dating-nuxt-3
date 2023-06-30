export const state = () => ({
    userData: {}
  })
  
  export const mutations = {
    setUserData(state, userData) {
      state.userData = userData
    }
  }
  
  export const getters = {
    userData: state => state.userData
  }
  