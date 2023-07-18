<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- The welcome banner -->
      <v-row>
        <v-col cols="12">
          <v-card class="elevation-12" color="secondary" dark>
            <v-card-text class="text-center display-3">
              {{ $t('banner') }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>



      <v-row>
        <!-- Left column --  Sign Up Form -->
        <v-col cols="12" sm="8" md="6" class="left-form">
          <!-- The signup form -->
          <v-card class="elevation-12" color="white">
            <v-toolbar color="primary" dark>
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
  <v-col v-if="dob">
    <v-text-field
      id="dob-month"
      :label="$t('dobMonthLabel')"
      v-model="dob.month"
      type="number"
      min="1"
      max="12"
      placeholder="Month"
    ></v-text-field>
  </v-col>
  <v-col v-if="dob">
    <v-text-field
      id="dob-day"
      :label="$t('dobDayLabel')"
      v-model="dob.day"
      type="number"
      min="1"
      max="31"
      placeholder="Day"
    ></v-text-field>
  </v-col>
  <v-col v-if="dob">
    <v-text-field
      id="dob-year"
      :label="$t('dobYearLabel')"
      v-model="dob.year"
      type="number"
      min="1900"
      max="2099"
      placeholder="Year"
    ></v-text-field>
  </v-col>
</v-row>

                <v-radio-group v-model="gender" row>
                  <v-radio id="gender-male" label="Male" value="male"></v-radio>
                  <v-radio id="gender-female" label="Female" value="female"></v-radio>
                </v-radio-group>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" dark type="submit" @click="submitSignUpForm">{{ $t('signUpButtonLabel') }}</v-btn>
              <!-- <v-spacer></v-spacer> -->
              <!-- <v-btn color="secondary" dark @click="navigateToLogin">{{ $t('loginButtonLabel') }}</v-btn> -->
            </v-card-actions>
            <v-card-text>
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="12">
                    <div class="login-text text-center">
                      <!-- Already have an account? Click on the login button below. -->
                      <!-- <br> -->
                      Complete your profile on the next page, including adding a profile picture.
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right column -- Login Form -->
        <v-col cols="12" sm="8" md="6" class="right-form">
          <!-- The login form -->
          <v-card class="elevation-12" color="white">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>{{ $t('loginFormLabel') }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field v-model="userId" id="userId" label="UserId" name="username" prepend-icon="mdi-account"
                  type="text"></v-text-field>
                <v-text-field id="password" :label="$t('passwordLabel')" name="password" prepend-icon="mdi-lock"
                  type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark type="submit" @click="submitLoginForm" @keydown.enter="submitLoginForm">{{
                $t('loginButtonLabel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>


    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';


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
      userId: '', // Define userId property
    };
  },
  computed: {
    ...mapGetters(['newAddress']),
  },
  mounted() {
    // this.$store.commit('setServerAddress', 'http://localhost:4000');
    this.$store.dispatch('setServerAddress', 'http://localhost:4000');

    this.logToAPI('mounted');

    if (this.$i18n.locale === 'he') {
      this.isLTR = false; // Set direction to right-to-left (RTL)
    }
  },
  created() {
    this.logToAPI("am here");
  },
  methods: {
    async logToAPI(message) {
      const requestBody = {
        message: message
      };

      try {
        console.log('about to do an axios.post');
        const response = await axios.post('http://localhost:4000/logger', requestBody);
        console.log('Log entry created successfully');
      } catch (error) {
        console.error('Failed to create log entry:', error);
      }
    },
    navigateToLogin() {
      this.logToAPI("about to go to login");
      this.$router.push({
        path: '/login',
        // query: { user: JSON.stringify(userData) }
      });
    },
    submitLoginForm() {
      this.logToAPI('login');

      const userData = {
        userId: this.userId, // Use the actual user ID here
        password: this.password,
      };

      if (!this.dob.month) {
        console.error('Month is required.');
        return;
      }
      axios.post('http://localhost:4000/login', userData)
        .then(response => {
          // Handle the success response
          console.log(response.data);
          console.log("I'm about to try to get you to the admin page");

          localStorage.setItem('userData', JSON.stringify(userData));
          // document.cookie = `userData=${JSON.stringify(userData)}; expires=Thu, 1 Jan 2030 00:00:00 UTC; path=/`;

          const userData = {
            userId: 123,
            password: "examplepassword"
          };
          this.$store.commit('setUserData', userData);

          const userParam = this.$store.getters.userData;

          this.$router.push({
            path: '/mainpage',
            // query: { userData: JSON.stringify(userData) }
          });
          // Redirect to the desired page after login
          // this.$router.push('/dashboard');
        })
        .catch(error => {
          // Handle the error response
          console.error(error);
        });
    },
    submitSignUpForm() {
      this.logToAPI("am trying to sign up");

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

          this.$store.commit('setUserData', userData);

          this.logToAPI('index page about to change to dating profile page');
          this.$router.push({
            path: '/datingprofile',
            // query: { user: JSON.stringify(userData) }
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};



<style scoped>
#inspire {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-text {
  margin-bottom: 20px;
  margin-left: 20px;
  /* Adjust the value as needed */
}

.left-form {
  justify-self: flex-start;
}

.right-form {
  justify-self: flex-end;
}

[dir="rtl"] .left-form,
[dir="rtl"] .right-form {
  justify-self: initial;
  /* Reset the justify-self property for RTL direction */
}
</style>
