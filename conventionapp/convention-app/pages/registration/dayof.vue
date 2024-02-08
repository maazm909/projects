<template>
  <v-container fluid>
    <v-row justify="center">
      <v-sheet width="100%">
        <v-form @submit.prevent>
          <v-container fluid>
            <v-row>
              <AttendeeRow />
            </v-row>
            <v-row justify="center">
              <v-btn type="submit">Submit</v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
</script>

<script lang="ts">
export default defineComponent({
  data: () => ({}),
});
</script>

<style></style>
