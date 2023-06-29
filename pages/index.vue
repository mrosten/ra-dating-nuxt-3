<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- The welcome banner -->
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card class="elevation-12" color="secondary" dark>
            <v-card-text class="text-center display-3">
              {{ $t('banner') }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- The signup form -->
      <v-row align="left" justify="left">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12" color="white">
            <v-toolbar align="left" color="primary" dark>
              <v-toolbar-title>{{ $t('signUpFormLabel') }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="submitForm">
                <v-text-field id="name" :label="$t('nameLabel')" name="name" prepend-icon="mdi-account-box" v-model="name"
                  type="text"></v-text-field>
                <v-text-field id="email" :label="$t('emailLabel')" name="email" prepend-icon="mdi-email" v-model="email"
                  type="text"></v-text-field>
                <v-text-field id="username" :label="$t('usernameLabel')" name="username" prepend-icon="mdi-account"
                  v-model="username" type="text"></v-text-field>
                <v-text-field id="password" :label="$t('passwordLabel')" name="password" prepend-icon="mdi-lock"
                  v-model="password" type="password"></v-text-field>
                <v-row>
                  <v-col>
                    <v-text-field id="dob-month" :label="$t('dobMonthLabel')" v-model="dob.month" type="number" min="1"
                      max="12" placeholder="Month"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field id="dob-day" :label="$t('dobDayLabel')" v-model="dob.day" type="number" min="1" max="31"
                      placeholder="Day"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field id="dob-year" :label="$t('dobYearLabel')" v-model="dob.year" type="number" min="1900"
                      max="2099" placeholder="Year"></v-text-field>
                  </v-col>
                </v-row>
                <v-radio-group v-model="gender" row>
                  <v-radio id="gender-male" label="Male" value="male"></v-radio>
                  <v-radio id="gender-female" label="Female" value="female"></v-radio>
                </v-radio-group>
              </v-form>
            </v-card-text>
        

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark type="submit" @click="submitForm">{{ $t('signUpButtonLabel') }}</v-btn>
              <v-btn color="secondary" dark @click="navigateToLogin">{{ $t('loginButtonLabel') }}</v-btn>
            </v-card-actions>

          </v-card>
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
  name: 'Rav-Avner-Dating',
  data() {
    return {
      valid: false,
      name: '',
      email: '',
      username: '',
      password: '',
      dob: {
        month: '',
        day: '',
        year: '',
      },
      gender: '',
    };
  },
  created() {
    logToAPI("am here");
  },
  
  methods: {
  navigateToLogin() {
    this.$router.push('/login');
  },

  submitForm() {
    logToAPI("am trying to sign up");

    // Perform input validation
    if (!this.name) {
      alert("Please enter a name"); // Notify the user
      return; // Exit the function
    }

    const userData = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      dob: {
        month: this.dob.month,
        day: this.dob.day,
        year: this.dob.year,
      },
      gender: this.gender,
    };

    console.log("userData=" + JSON.stringify(userData));
    axios.post('http://localhost:4000/signup', userData)
      .then(response => {
        const insertedId = response.data.userId;
        userData._id = insertedId;
        console.log('insertedId=' + insertedId);
        this.$router.push({
          path: '/datingprofile',
          query: { user: JSON.stringify(userData) }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
}

};
</script>

<style scoped>
#inspire {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}</style>
