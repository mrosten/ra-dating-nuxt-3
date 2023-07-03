<template>
  <v-app id="inspire" style="background: #007FFF">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12" color="white">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>{{ $t('loginFormLabel') }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field :label="$t('usernameLabel')" name="username" prepend-icon="mdi-account"
                  type="text"></v-text-field>
                <v-text-field id="password" :label="$t('passwordLabel')" name="password" prepend-icon="mdi-lock"
                  type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark>התחברות</v-btn>
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
  name: 'Login',

  created() {
    logToAPI("login just created");
  },

  data() {
    return {
      valid: false,
      username: '',
      password: ''
    };
  }
};
</script>
  
<style scoped>
#inspire {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>