require('dotenv').config();

import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head

  head: {
    titleTemplate: '%s - ra-dating-nuxt-3',
    title: 'ra-dating-nuxt-3',
    htmlAttrs: {
      lang: 'en',
      // dir: 'rtl'
    },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],

    build: {
      extend(config, { isDev, isClient }) {
        // Enable devtools in development mode
        if (isDev && isClient) {
          config.devtool = 'source-map';
        }
      },
      devtools: true
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/globalVariables.js', ssr: true }
  ],
  vue: {
    devtools: true
  },

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
      { code: 'en', iso: 'en-US', name: 'English', dir: 'ltr' },
      { code: 'fr', iso: 'fr-FR', name: 'Français', dir: 'ltr' },
      { code: 'he', iso: 'he-IL', name: 'עברית', dir: 'rtl' },
    ],
    defaultLocale: 'he',
    vueI18n: {
      fallbackLocale: 'he',
      messages: {
        en: {
          "title": "Rav Avner Dating Site",
          "welcome": "Welcome",
          "home": "Home",
          "about": "About",
          "services": "Services",
          "loginFormLabel": "Login Form",
          "signUpFormLabel": "Sign Up Form",
          "nameLabel": "Name",
          "emailLabel": "Email",
          "usernameLabel": "Username",
          "passwordLabel": "Password",
          "dobMonthLabel": "Month",
          "dobDayLabel": "Day",
          "dobYearLabel": "Year",
          "signUpButtonLabel": "Sign Up",
          "loginButtonLabel": "Login",
          "banner": "Welcome, May You Be Blessed"
        },
        fr: {
          "title": "Site de rencontre Rav Avner",
          "welcome": "Bienvenue",
          "home": "Accueil",
          "Home": "zzzzz",
          "about": "À propos",
          "services": "Services",
          "loginFormLabel": "Formulaire de connexion",
          "signUpFormLabel": "Formulaire d'inscription",
          "nameLabel": "Nom",
          "emailLabel": "Email",
          "usernameLabel": "Nom d'utilisateur",
          "passwordLabel": "Mot de passe",
          "dobMonthLabel": "Mois",
          "dobDayLabel": "Jour",
          "dobYearLabel": "Année",
          "signUpButtonLabel": "S'inscrire",
          "loginButtonLabel": "Connexion",
          "banner": "Bienvenue, Que Vous Soyez Béni(e)"
        },
        he: {
          "title": "אתר של רב אבנר",
          "welcome": "ברוך הבא",
          "home": "בית",
          "Home": "ldkjfadsf",
          "about": "אודות",
          "services": "שירותים",
          "loginFormLabel": "טופס התחברות",
          "signUpFormLabel": "טופס הרשמה",
          "nameLabel": "שם",
          "emailLabel": "דוא\"ל",
          "usernameLabel": "שם משתמש",
          "passwordLabel": "סיסמה",
          "dobMonthLabel": "חודש",
          "dobDayLabel": "יום",
          "dobYearLabel": "שנה",

          "loginButtonLabel": "התחברות",
          "signUpButtonLabel": "הרשמה",
          "banner": "ברוכים הבאים, תהיו מבורכים"
        }
      },
    },
  },


  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    proxy: true // Can be also an object with default options
  },

  proxy: {
    '/api/': 'http://api.example.com',
    '/api2/': 'http://api.another-website.com'
  },



  serverMiddleware: [
    '~/server/status.js'
  ],

  server: {
    port: 3400, // Default port is usually 3000
    // host: '0.0.0.0', // Set the host to '0.0.0.0' to make it accessible from outside
  },


  // vuetify: {
  // rtl: true,
  //   customVariables: ['~/assets/variables.scss'],
  //   theme: {
  //     dark: true,
  //     themes: {
  //       dark: {
  //         primary: '#FF4081', // Set your primary color
  //         secondary: '#9C27B0', // Set your secondary color
  //         accent: '#FFC107', // Set your accent color
  //         error: '#F44336', // Set your error color
  //         warning: '#FF9800', // Set your warning color
  //         info: '#2196F3', // Set your info color
  //         success: '#4CAF50' // Set your success color
  //       },
  //       light: {
  //         primary: '#FF4081', // Set your primary color
  //         secondary: '#9C27B0', // Set your secondary color
  //         accent: '#FFC107', // Set your accent color
  //         error: '#F44336', // Set your error color
  //         warning: '#FF9800', // Set your warning color
  //         info: '#2196F3', // Set your info color
  //         success: '#4CAF50' // Set your success color
  //       }
  //     }
  //   }
  // },
}
