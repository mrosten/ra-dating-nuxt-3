export const state = () => ({
    userData: {},
    raServer: 'http://localhost:4000'
  })
  
  export const mutations = {
    setUserData(state, userData) {
      state.userData = userData
    }
  }
  
  export const getters = {
    userData: state => state.userData
  }
