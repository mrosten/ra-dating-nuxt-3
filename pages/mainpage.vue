<template>
  <div class="home-page">
    <section class="hero-section">
      <h1>Welcome {{ userData.name }} to Rav Avner Dating</h1>
      <v-img src="/images/hero-image.jpg" alt="Dating App Hero Image"></v-img>
    </section>

    <section class="matches-section">
      <h2>Matches</h2>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="(match, index) in initialMatches" :key="index">
            <v-card>
            <v-card-item>
              <template v-slot:prepend>
                <v-card-title>
                  <p> {{ match.body }}</p>
                </v-card-title>
              </template>

              <v-divider vertical class="mx-2"></v-divider>

              <template v-slot:append>
                <v-btn icon="$close" size="large" variant="text"></v-btn>
              </template>
            </v-card-item>

            <v-card-item>
              <v-card-title class="text-body-2 d-flex align-center">
                <span class="text-medium-emphasis font-weight-bold">{{ match.id }}</span>
                <v-spacer></v-spacer>
              </v-card-title>

              <div class="py-2">
                <div class="text-h6">{{ match.userName }}</div>
                <div class="font-weight-light text-medium-emphasis">{{ match.userName }}</div>
              </div>
            </v-card-item>

            <v-divider></v-divider>

            <div class="pa-4 d-flex align-center">
              <v-spacer></v-spacer>
              <v-btn class="me-2 text-none" color="#4f545c" variant="flat">
                Maybe not
              </v-btn>
              <v-btn border class="text-none" prepend-icon="mdi-check" variant="text">
                Interested
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Rest of the component code... -->

    <v-dialog v-model="showModal">
      <v-card>
        <v-card-title>
          <span class="headline">Match Details</span>
        </v-card-title>
        <v-card-text>
          <p>Match index: {{ modalIndex }}</p>
          <!-- Add additional match details here -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      userData: {},
      initialMatches: [],
      showModal: false,
      modalIndex: null
    };
  },
  created() {
    // Fetch user data and populate initial matches
    
    const userDataString = this.$route.query.userData;
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
    }
    // this.userData = this.$store.getters.userData;
    this.populateInitialMatches();
  },
  methods: {
    async populateInitialMatches() {
      try {
        const userId = this.userData._id;
        const response = await axios.get(`http://localhost:4000/api/userMatches/${userId}`);
        const { users } = response.data;

        this.initialMatches = users.map((user, index) => ({
          id: user._id,
          title: `Match #${index + 1}`,
          userName: `Beeody for Match #${index + 1}`,
          body: user._id
        }));
      } catch (error) {
        console.error(error);
      }
    },
    openModal(index) {
      this.modalIndex = index;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalIndex = null;
    }
  }
}
</script>

<style scoped>
/* Add your custom styles for the home page here */

/* Example styles for the sections */
.hero-section {
  text-align: center;
  padding: 2rem;
}

.matches-section {
  text-align: center;
  padding: 2rem;
}

/* Rest of the styles... */
</style>