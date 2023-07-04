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
          <div class="match-card">
            <h3>Match #{{ index + 1 }}</h3>
            <p>{{ match.body }}</p>
            <!-- Add match details and styling as per your requirements -->
          </div>
        </v-col>
      </v-row>
    </section>

    <!-- Rest of the component code... -->
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      userData: {},
      initialMatches: []
    };
  },
  created() {
    const userParam = this.$store.getters.userData;
    this.userData = userParam;
    this.populateInitialMatches();
  },
  methods: {
    populateInitialMatches() {
      // Populate initial matches with 9 matches
      for (let i = 0; i < 9; i++) {
        this.initialMatches.push({ id: i, title: `Match #${i + 1}`, body: `Body for Match #${i + 1}` });
      }
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

.match-card {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Rest of the styles... */
</style>
