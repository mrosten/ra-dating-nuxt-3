<template>
  <v-app>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Profile Picture Setup</v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-row>
        <v-col>
          <h1>Welcome, {{ user && user.username }}!</h1>
          <p>Email: {{ user && user.email }}</p>
          <h2>Profile Picture</h2>
          <v-img v-if="profilePicture" :src="profilePicture" alt="Profile Picture" max-width="200px"></v-img>
          <v-file-input ref="fileInput" accept="image/*" label="Upload file" @change="handleFileChange"></v-file-input>
          <v-btn @click="uploadProfilePicture" :disabled="!selectedFile" color="primary">Upload</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

function logToAPI(message) {
  const requestBody = {
    message: message
  };

  axios.post('http://localhost:4000/logger', requestBody)
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
      selectedFile: null,
    };
  },
  created() {
    const userParam = this.$store.getters.userData;
    this.user = userParam;
    logToAPI('User details:' + JSON.stringify(this.user));
  },
  methods: {
    handleFileChange(event) {
      // event.preventDefault();
      //  
      this.selectedFile = event;
      logToAPI("handlfilechange called" + event);
    },
    uploadProfilePicture() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('profilePicture', this.selectedFile);
        formData.append('userID', this.user._id);

        axios.post('http://localhost:4000/api/uploadProfilePicture', formData)
          .then(response => {
            this.profilePicture = response.data.profilePicture;
            this.selectedFile = null;

            this.$router.push({
              path: '/ConfirmationPage',
              query: { userData: JSON.stringify(this.user) }
            });

          })
          .catch(error => {
            logToAPI("ERROR" + JSON.stringify(error));
          });
      }
    },
  },
};
</script>
