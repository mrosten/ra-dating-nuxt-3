<template>
  <v-app>
    <v-toolbar-component color="indigo" dark>
      <v-toolbar-title style="background-color: rgb(138, 96, 168)" dark class="profile-title">Profile</v-toolbar-title>
    </v-toolbar-component>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12">
        <v-card class="elevation-12" color="white">
          <p><strong>Username:</strong> {{ user.username || 'Loading...' }}</p>
          <p><strong>Email:</strong> {{ user.email || 'Loading...' }}</p>
          <p v-if="user.dob"><strong>Date of Birth:</strong> {{ user.dob.month }}/{{ user.dob.day }}/{{ user.dob.year }}
          </p>
          <p><strong>Gender:</strong> {{ user.gender || 'Loading...' }}</p>
          <p><strong>Profile Info:</strong> {{ user.profileInfo || 'Loading...' }}</p>
          <p><strong>Role:</strong> {{ user.role || 'Loading...' }}</p>
          <p><strong>Matches:</strong></p>


          <ul>
            <li v-for="(match, index) in user.matches" :key="match">
              <strong>ID:</strong> {{ match }} <br>
              <div v-if="users[match]">
                <!-- Display user data from API -->
                <strong>Name:</strong> {{ users[match].name }} <br>
                <strong>Email:</strong> {{ users[match].email }} <br>
                <!-- Add more properties as needed -->
              </div>
            </li>
          </ul>



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
  methods: {

    getAllMatchInfo(index) {
      logToAPI("All Match Info: " + JSON.stringify(this.matchUsers[index]))
    },

    async fetchUsers() {
      for (const match of this.user.matches) {
        const response = await fetch(`http://localhost:4000/user/${match}`);
        const userData = await response.json();
        this.$set(this.users, match, userData);
      }
    },

    fetchMatchUsers() {
      const matchUsers = [];

      const promises = this.user.matches.map(match => {
        logToAPI('about to call this: ' + `http://localhost:4000/api/getOtherUserId?matchId=${match}&userId=${this.profileId}`);
        return fetch(`http://localhost:4000/api/getOtherUserId?matchId=${match}&userId=${this.profileId}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to fetch other user');
            }
          })
          .then(data => {
            if (data.error) {
              // Handle the case when the match or user is not found
              console.error(data.error);
              matchUsers.push(null); // Assign null or other default value to matchUsers
            } else {

              logToAPI("otherid: " + data.otherUserId);
              matchUsers.push(data); // Add the other user's data to matchUsers array

            }
          })
          .catch(error => {
            console.error('Error fetching other user:', error);
            matchUsers.push(null); // Assign null or other default value to matchUsers
          });
      });

      Promise.all(promises)
        .then(() => {
          console.log('All match users fetched');
          this.matchUsers = matchUsers; // Assign the matchUsers array to a data property
        })
        .catch(error => {
          console.error('Error fetching match users:', error);
          this.matchUsers = []; // Assign an empty array or other default value
        });
    },
  },
  computed: {
    profileId() {
      return this.$route.query.userId;
    },
  },
  data() {
    return {
      user: {
        username: '',
        email: '',
        dob: {},
        gender: '',
        profileInfo: '',
        role: '',
        matches: []
      },
      users: {} // Initialize an empty array to store match users
    };
  },
  mounted() {
    this.fetchUsers();
  },
  created() {
    logToAPI('User id: ' + this.profileId);

    fetch('http://localhost:4000/user/' + this.profileId)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch user documents');
        }
      })
      .then(data => {
        this.user = data;
        logToAPI("about to fetch:");
        this.fetchMatchUsers();
        logToAPI(JSON.stringify(this.matchUsers));
      })
      .catch(error => {
        console.error('Failed to fetch user documents:', error);
      });

    logToAPI(JSON.stringify(this.user));
  }
}
</script>

<style>
.profile-title {
  font-size: 20px;
  height: 48px;
}
</style>
