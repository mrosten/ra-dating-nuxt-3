<template>
  <div class="admin-page">
    <h1 class="admin-page__title">Rav Avner's Administration Page</h1>
    <v-card class="admin-page__table-container">
      <v-data-table :headers="headers" :items="users" :items-per-page="15" :search="search" sort-by="username"
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" label="Search" clearable solo-inverted></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="toggleEdit(item)">{{ item.editing ? 'save' : 'edit' }}</v-icon>
        </template>
        <template v-slot:item.action2="{ item }">
          <v-icon small @click="goToProfilePage(item)">mdi-account-circle</v-icon>
        </template>
        <template v-slot:item.action3="{ item }">
          <v-icon small @click="deleteProfile(item)">mdi-account-circle</v-icon>
        </template>
        <template v-slot:item.role="{ item }">
          <v-select v-model="item.role" :items="['user', 'admin']" :disabled="!item.editing" outlined></v-select>
        </template>
        <template v-slot:item.username="{ item }">
          <v-text-field v-model="item.username" :disabled="!item.editing" outlined></v-text-field>
        </template>
        <template v-slot:item.email="{ item }">
          <v-text-field v-model="item.email" :disabled="!item.editing" outlined></v-text-field>
        </template>
        <template v-slot:item.password="{ item }">
          <v-text-field v-model="item.password" :disabled="!item.editing" outlined></v-text-field>
        </template>

      </v-data-table>
    </v-card>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      users: [],
      search: '',
      headers: [
        { text: 'Username', value: 'username', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'Password', value: 'password', sortable: false },
        { text: 'Role', value: 'role', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: 'Action #2', value: 'action2', sortable: false },
        { text: 'Action #3', value: 'action3', sortable: false },

      ],
    };
  },
  mounted() {
    this.fetchUserDocuments();
  },
  methods: {
    async fetchUserDocuments() {
      try {
        const response = await fetch('http://localhost:4000/api/users');
        if (response.ok) {
          const data = await response.json();
          this.users = data;
        } else {
          throw new Error('Failed to fetch user documents');
        }
      } catch (error) {
        console.error(error);
      }
    },
    toggleEdit(user) {
      if (user.editing) {
        console.log('Been editing? - now saving');
        this.saveUser(user);
      }
      user.editing = !user.editing;
    },
    async saveUser(user) {
      try {
        console.log('Trying to Save User');
        const { _id, username, email, profileInfo, role } = user;
        const updatedData = {
          username,
          email,
          profileInfo,
          role,
        };

        await fetch(`http://localhost:4000/users/${_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
      } catch (error) {
        console.error(error);
      }
    },
    sortByUsername() {
      logToAPI('hi');
    },

    async deleteProfile(user) {
      try {
        await fetch(`http://localhost:4000/users/${user._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        this.fetchUserDocuments();

      } catch (error) {
        console.error(error);
      }
    },

    goToProfilePage(user) {
      this.$router.push({
        path: '/DatingProfilePage',
        query: { user: JSON.stringify(user) },
      });
    },
  },
};
</script>
<style scoped>
.admin-page {
  margin: 20px auto;
  max-width: 0 auto;
}

.admin-page__title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
}

.admin-page__table-container {
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.admin-page__table th,
.admin-page__table td {
  padding: 10px;
  text-align: left;
}

.admin-page__table th {
  background-color: #333;
  color: #fff;
}

.admin-page__table tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

.admin-page__table tbody tr:hover {
  background-color: #e2e2e2;
}

.admin-page__table td {
  vertical-align: middle;
}
</style>
  