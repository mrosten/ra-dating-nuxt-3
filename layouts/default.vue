
<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title>{{ $t('title') }}</v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click="clipped = !clipped"></v-app-bar-nav-icon>

      <v-btn @click="switchLanguage('he')">עברית</v-btn>
      <v-btn @click="switchLanguage('fr')">Français</v-btn>
      <v-btn @click="switchLanguage('en')">English</v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in menuItems" :key="index" @click="navigate(item.route)">
            <v-list-item-title>{{ $t(item.label) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      title: 'אתר של רב אבנר'
    };
  },
  computed: {
    menuItems() {
      return [
        { label: 'home', route: '/' },
        { label: 'about', route: '/about' },
        { label: 'services', route: '/services' }
      ];
    }
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
    switchLanguage(locale) {
      this.$i18n.locale = locale;
    }
  }
};
</script>

