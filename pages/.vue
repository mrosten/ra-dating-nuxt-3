<template>
    <v-container fluid class="text-center">
      <h1 class="display-1 mb-4">Welcome, {{ user && user.username }}!</h1>
      <p class="headline mb-4">Email: {{ user && user.email }}</p>
      <h2 class="headline mb-4">Profile Picture</h2>
      <div v-if="profilePicture">
        <v-img :src="profilePicture" alt="Profile Picture" width="200"></v-img>
      </div>
      <div class="mb-4">
        <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange">
      </div>
      <div>
        <v-btn color="primary" dark @click="uploadProfilePicture" :disabled="!selectedFile">Upload</v-btn>
      </div>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  function logToAPI(message) {
    const requestBody = {
      message: message
    };
  
    axios
      .post('http://localhost:4000/logger', requestBody)
      .then(response => {
        console.log('Log entry created successfully');
      })
      .catch(error => {
        console.error('Failed to create log entry:', error);
      });
  }
  
  export default {
    data() {
      return {
        user: null,
        profilePicture: null,
        selectedFile: null
      };
    },
    mounted() {
      const userParam = this.$route.query.user;
      this.user = userParam ? JSON.parse(userParam) : null;
      logToAPI('User details:' + JSON.stringify(this.user));
    },
    methods: {
      handleFileChange(event) {
        this.selectedFile = event.target.files[0];
      },
      uploadProfilePicture() {
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('profilePicture', this.selectedFile);
          formData.append('userID', this.user._id);
  
          axios
            .post('http://localhost:4000/api/uploadProfilePicture', formData)
            .then(response => {
              this.profilePicture = response.data.profilePicture;
              this.selectedFile = null;
  
              this.$router.push({
                path: '/ConfirmationPage',
                query: { userData: JSON.stringify(this.user) }
              });
            })
            .catch(error => {
              logToAPI('ERROR' + JSON.stringify(error));
            });
        }
      }
    }
  };
  </script>
  