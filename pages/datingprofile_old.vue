<template>
  <v-container fluid>

    <h1 class="display-1 text-center">Welcome, {{ user?.username }}!</h1>
    <p class="headline text-center">Email: {{ user?.email }}</p>

    <h2 class="headline text-center">Profile Picture</h2>
    <div v-if="profilePicture" class="text-center">
      <v-img :src="profilePicture" alt="Profile Picture" width="200"></v-img>
    </div>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-file-input v-model="selectedFile" label="Select Profile Picture" accept="image/*"
          @change="handleFileChange"></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-btn color="primary" dark block @click="uploadProfilePicture" :disabled="!selectedFile">Upload</v-btn>
      </v-col>
    </v-row>
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

    logToAPI('in Mounted');
    const userParam = this.$store.getters.userData;
    logToAPI('mounted2 - ' + JSON.stringify(userParam));
    // const userParam = this.$route.query.user;
    this.user = userParam;
    // logToAPI(this.user + " - this.user");
    logToAPI('mounted3:' + JSON.stringify(this.user));
  },
  methods: {
    handleFileChange(event) {
      logToAPI('datingprofile - handleFileChange + : ' + JSON.stringify(this.user) + " " + event.target.files[0]);
      this.selectedFile = event.target.files[0];
    },

    uploadProfilePicture() {
      logToAPI('datingprofile - upload');
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
  