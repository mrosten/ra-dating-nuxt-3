<template>
  <v-app>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Profile Picture Setup</v-toolbar-title>
    </v-toolbar>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12">

        <v-card class="elevation-12" color="white">
          <v-toolbar color="primary" dark>
          </v-toolbar>

          <v-row justify="left" class="mt-5">
            <v-col cols="12" sm="6">
              <h2 class="mb-3">Profile Picture</h2>
              <v-img v-if="profilePicture" :src="profilePicture" alt="Profile Picture" max-width="200px"></v-img>
              <v-file-input ref="fileInput" accept="image/*" label="Upload file"
                @change="handleFileChange"></v-file-input>
              <v-btn @click="uploadProfilePicture" :disabled="!selectedFile" color="primary">Upload</v-btn>
            </v-col>
            <v-col cols="12" sm="6" class="text-right pr-5">
              <v-card class="elevation-2" height="200px" outlined>
                <v-card-text class="text-center">
                  <h3>Uploaded Picture</h3>
                  <v-img v-if="uploadedPicture" :src="uploadedPicture" alt="Uploaded Picture" contain></v-img>
                  <div v-else class="text-grey">No picture uploaded yet</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-5">
            <v-col cols="12">
              <h2>Bio</h2>
              <v-textarea v-model="bio" label="Bio" outlined></v-textarea>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12">
              <h2>Interests</h2>
              <v-textarea v-model="interests" label="Interests" outlined></v-textarea>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12">
              <h2>Hobbies</h2>
              <v-textarea v-model="hobbies" label="Hobbies" outlined></v-textarea>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12">
              <h2>Preferences</h2>
              <v-textarea v-model="preferences" label="Preferences" outlined></v-textarea>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-5">
            <v-col cols="12" sm="6">
              <v-btn block color="primary" class="mb-3">Submit</v-btn>
              <v-btn @click="navigateToMainPage" block color="grey" class="mb-3">Fill In Later</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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
      uploadedPicture: '', // Initialize uploadedPicture property
      bio: '', // Initialize bio property
      interests: '', // Initialize interests property
      hobbies: '', // Initialize hobbies property
      preferences: '' // Initialize preferences property
    };
  },
  created() {
    const userParam = this.$store.getters.userData;
    this.user = userParam;
    logToAPI('User details:' + JSON.stringify(this.user));
  },
  methods: {
    navigateToMainPage() {
      this.$router.push({
        path: '/mainpage',
        query: { user: JSON.stringify(userData) }
      });
    },

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
              path: '/mainpage',
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
