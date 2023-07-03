<template>
  <div class="home-page">
    <section class="hero-section">
      <h1>Welcome to My Dating App</h1>
      <p>Find your perfect match and start your romantic journey today!</p>
      <v-img src="/images/hero-image.jpg" alt="Dating App Hero Image"></v-img>
    </section>

    <section class="testimonials-section">
      <h2>Success Stories</h2>
      <v-row class="testimonial-card">
        <v-col cols="12" sm="6" md="4">
          <v-img src="/images/user1.jpg" alt="User 1"></v-img>
          <blockquote>"I found my soulmate on this app. Thank you!"</blockquote>
          <p>- Emily</p>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-img src="/images/user2.jpg" alt="User 2"></v-img>
          <blockquote>"The app helped me meet someone amazing. Highly recommended!"</blockquote>
          <p>- Mark</p>
        </v-col>
      </v-row>
    </section>

    <section class="features-section">
      <h2>Key Features</h2>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-img src="/images/feature1.png" alt="Feature 1"></v-img>
          <h3>Advanced Matching</h3>
          <p>Our advanced matching algorithm ensures you find compatible partners.</p>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-img src="/images/feature2.png" alt="Feature 2"></v-img>
          <h3>Secure Messaging</h3>
          <p>Communicate safely with our encrypted messaging system.</p>
        </v-col>
      </v-row>
    </section>

    <section class="social-proof-section">
      <h2>Join Our Community</h2>
      <div class="social-proof">
        <p><span class="count">1.5M+</span> Registered Users</p>
        <p><span class="count">500K+</span> Successful Matches</p>
        <div class="social-media-icons">
          <a href="#"><v-icon fab fa-facebook"></v-icon></a>
          <a href="#"><v-icon fab fa-twitter"></v-icon></a>
          <a href="#"><v-icon fab fa-instagram"></v-icon></a>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Join Our Dating App Today</h2>
      <p>Sign up now and start your journey towards finding love.</p>
      <v-btn class="cta-button">Join Now</v-btn>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  // Add any necessary data, methods, or computed properties
}
</script>

<style scoped>
/* Add your custom styles for the home page here */

/* Example styles for the sections */
.hero-section {
  text-align: center;
  padding: 2rem;
}

.testimonials-section {
  text-align: center;
  padding: 2rem;
}

.features-section {
  text-align: center;
  padding: 2rem;
}

.social-proof-section {
  text-align: center;
  padding: 2rem;
}

.cta-section {
  text-align: center;
  padding: 2rem;
}
</style>
export default {
    mounted() {
      // Retrieve the query parameter value from the $route object
      const userData = JSON.parse(this.$route.query.userData);
  
      // Now you can access the user data
      console.log(userData);
      // Perform any necessary operations with the user data
    },
  };
  