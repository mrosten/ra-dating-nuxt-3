export const state = () => ({
    userData: {},
    raServer: 'http://localhost:4000'
    serverAddress: {
      address: ''
    }
  })
  
  export const mutations = {
    setUserData(state, userData) {
      state.userData = userData
    },
    setServerAddress(state, newAddress) {
      state.serverAddress.address = newAddress;
    }
  }
  
  export const getters = {
    userData: state => state.userData,
    newAddress: serverAddress => serverAddress.address
  }


  export const serverAddress = () => ({
    address: {}
  })

  export const actions = {
    setServerAddress({ commit }, newAddress) {
      commit('setServerAddress', newAddress);
    }
  };
  
