<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col> <v-text-field label="First Name"></v-text-field> </v-col>
      <v-col> <v-text-field label="Last Name"></v-text-field> </v-col>
      <v-col> <v-text-field label="Age" :rules="rules"></v-text-field> </v-col>
      <v-col cols="1">
        <v-radio-group>
          <v-radio label="Male" value="male"></v-radio>
          <v-radio label="Female" value="female"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rules: [
      (value: string) => {
        if (value) return true;

        return "You must enter a first name.";
      },
    ],
  }),
});
</script>

<style></style>
