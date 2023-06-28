import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ra-dating-nuxt-3',
    title: 'ra-dating-nuxt-3',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],


  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',

  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'fr', iso: 'fr-FR', name: 'Français' },
      { code: 'he', iso: 'he-IL', name: 'עברית' },
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          title: 'Rav Avner Dating Site',
          welcome: 'Welcome',
          home: 'Home',
          about: 'About',
          services: 'Services',
          loginFormLabel: "Login Form",
          usernameLabel: 'Username',
          passwordLabel: 'Password',
          loginLabel: 'Login',
        },
        fr: {
          title: 'le site de rav avner',
          welcome: 'Bienvenue',
          home: 'Accueil',
          about: 'À propos',
          services: 'Services',
          loginFormLabel: "Formulaire de connexion",
          usernameLabel: 'Nom d\'utilisateur',
          passwordLabel: 'Mot de passe',
          loginLabel: 'Connexion',
        },
        he: {
          title: 'אתר של רב אבנר',
          welcome: 'ברוך הבא',
          home: 'בית',
          about: 'אודות',
          services: 'שירותים',
          loginFormLabel: "טופס התחברות",
          usernameLabel: 'שם משתמש',
          passwordLabel: 'סיסמה',
          loginLabel: 'התחברות',
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
