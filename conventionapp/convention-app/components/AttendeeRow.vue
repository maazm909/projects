<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-text-field
          label="First Name"
          v-model="info.firstName"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field label="Last Name" v-model="info.lastName"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Age"
          v-model.number="info.age"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-radio-group v-model="info.gender">
          <v-radio label="Male" value="male"></v-radio>
          <v-radio label="Female" value="female"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { IAttendeeData } from "~/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    rowIndex: Number,
  },
  data: () => ({
    info: {
      firstName: "",
      lastName: "",
      age: 0,
      gender: "male",
    } as IAttendeeData,
    rules: [
      (value: string) => {
        if (value) return true;

        return "You must enter a first name.";
      },
    ],
  }),
  mounted() {
    // emit info to parent component to track
    this.$emit("infoChange", this.info, this.rowIndex);
  },
  watch: {
    info: {
      handler() {
        console.log("changeup");
        this.$emit("infoChange", this.info, this.rowIndex);
      },
      deep: true,
    },
  },
  emits: ["infoChange"],
});
</script>

<style></style>
