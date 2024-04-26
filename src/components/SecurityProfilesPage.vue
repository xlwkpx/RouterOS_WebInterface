<template>
  <div class="container">
    <h1>Security Profiles</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <table class="security-profile-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Authentication Types</th>
            <th>Mode</th>
            <th>WPA Pre-shared Key</th>
            <th>WPA2 Pre-shared Key</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(profile, index) in securityProfiles" :key="index">
            <td>{{ profile.name || '-' }}</td>
            <td>{{ profile['authentication-types'] || '-' }}</td>
            <td>{{ profile.mode || '-' }}</td>
            <td>{{ profile['wpa-pre-shared-key'] || '-' }}</td>
            <td>{{ profile['wpa2-pre-shared-key'] || '-' }}</td>
            <td>
              <!-- Add buttons for editing/deleting profiles -->
              <div style="display: flex; ">
                <button @click="eliminarProfile(profile)"> Delete </button>
                &nbsp;
                <button @click="toggleEditProfileModal(profile)"> Edit </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Button to open the add profile modal -->
      <div class="add-button">
        <v-btn @click="showAddProfileModal">Add Security Profile</v-btn>
      </div>
    </div>

    <v-dialog v-model="addProfileModal" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title>Add Security Profile</v-card-title>
        <v-card-text>
          <!-- Form for adding a new security profile -->
          <v-text-field v-model="newProfile.name" label="Name"></v-text-field>
          <v-select v-model="newProfile['mode']" :items="modeOptions" label="Mode"></v-select>
          <v-select v-model="newProfile['authentication-types']" :items="authenticationtypesOptions"
            label="Authentication Type"></v-select>
          <v-text-field v-model="newProfile['wpa-pre-shared-key']" label="WPA Pre-shared Key"></v-text-field>
          <v-text-field v-model="newProfile['wpa2-pre-shared-key']" label="WPA2 Pre-shared Key"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding profile -->
          <v-btn @click="cancelAddProfile">Cancel</v-btn>
          <!-- Button to save the new profile -->
          <v-btn color="primary" @click="saveNewProfile">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!-- Button to go back to Dashboard -->
    <div class="footer">
      <v-btn @click="goToDashboard">Back to Dashboard</v-btn>
    </div>


    <v-dialog v-model="showEditProfileModal" max-width="800px">
      <template v-slot:activator="{ on }"></template>
      <v-card>
        <v-card-title>Edit Profile Modal</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedProfile.name" label="Name"></v-text-field>
          <v-text-field v-model="selectedProfile['wpa-pre-shared-key']" label="WPA2 Pre-shared Key"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <!-- Button to cancel adding profile -->
          <v-btn @click="showEditProfileModal = false">Cancel</v-btn>
          <!-- Button to save the new profile -->
          <v-btn color="primary" @click="updateProfile">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const username = 'admin';
const password = '12345';
const basicAuth = btoa(`${username}:${password}`);

const getSecurityProfiles = async () => {
  try {
    const response = await fetch('/rest/interface/wireless/security-profiles', {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      }
    });
    console.log(response);
    return await response.json();


  } catch (error) {
    console.error('Error fetching security profiles:', error);
    return [];
  }
};

export default {
  setup() {
    const router = useRouter();
    const securityProfiles = ref([]);
    const loading = ref(true);
    const showEditProfileModal = ref(false);
    const addProfileModal = ref(false); // Control variable for showing/hiding add profile modal
    const newProfile = ref({}); // New profile object
    const selectedProfile = ref({}); // Selected profile object to edit
    const modeOptions = ref(['dynamic-keys', 'none']);
    const authenticationtypesOptions = ref(['wpa2-psk', 'wpa-psk']);





    onMounted(async () => {
      try {
        securityProfiles.value = await getSecurityProfiles();


      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    });

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    // Method to show the add profile modal
    const showAddProfileModal = () => {
      addProfileModal.value = true;
    };

    // Method to cancel adding profile
    const cancelAddProfile = () => {
      addProfileModal.value = false;
      newProfile.value = {}; // Reset new profile object
    };


    async function eliminarProfile(profile) {
      try {
        const response = await fetch('/rest/interface/wireless/security-profiles/' + profile[".id"], {
          method: "DELETE",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(newProfile.value)
        });

        console.log(newProfile.value);

        if (response.ok) {
          console.log('Profile deleted successfully!');
          newProfile.value = {};
          securityProfiles.value = await getSecurityProfiles();
          addProfileModal.value = false;
        } else {
          console.error('Failed to delete profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }

    const toggleEditProfileModal = (profile) => {
      showEditProfileModal.value = true
      selectedProfile.value = {
        ".id": profile['.id'],
        "name": profile.name,
        "wpa-pre-shared-key": profile['wpa-pre-shared-key']
      }
    }

    const updateProfile = async () => {
      console.log('In profile ....')
      console.log(selectedProfile.value)
      try {
        const response = await fetch('/rest/interface/wireless/security-profiles/' + selectedProfile.value[".id"], {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
          body: JSON.stringify(selectedProfile.value)
        });


        if (response.ok) {
          console.log('Profile updated successfully!');
          selectedProfile.value = {};
          getSecurityProfiles();
          showEditProfileModal.value = false;
        } else {
          console.error('Failed to update profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    // Method to save the new profile
    const saveNewProfile = async () => {
      try {
        // Send a PUT request to create the new profile
        const response = await fetch('/rest/interface/wireless/security-profiles', {
          method: "PUT",
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },


          body: JSON.stringify(newProfile.value)
        });

        console.log(newProfile.value);

        // Check if the request was successful (status code 200)
        if (response.ok) {
          console.log('New Profile created successfully!');
          // Reset new profile object
          newProfile.value = {};
          // Refresh the security profiles list
          securityProfiles.value = await getSecurityProfiles();
          // Close the modal
          addProfileModal.value = false;
        } else {
          // If the request failed, log the error
          console.error('Failed to create new profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    };

    return { securityProfiles, loading, goToDashboard, addProfileModal, showAddProfileModal, cancelAddProfile, saveNewProfile, newProfile, eliminarProfile, modeOptions, authenticationtypesOptions, toggleEditProfileModal, showEditProfileModal, selectedProfile, updateProfile };
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

h1 {
  margin-left: 20px;
}

.security-profile-table {
  width: 90%;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.security-profile-table th,
.security-profile-table td {
  padding: 12px;
  border-bottom: 1px solid #dddddd;
  text-align: left;
}

.security-profile-table th {
  background-color: #f2f2f2;
}

.loading {
  margin-top: 20px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
}

.add-button {
  margin-bottom: 20px;
}
</style>
