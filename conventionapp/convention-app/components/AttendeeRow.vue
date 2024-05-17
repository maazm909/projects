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
          <v-radio label="Male" value="Male"></v-radio>
          <v-radio label="Female" value="Female"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col v-if="mode === 'search-online'">
        <v-checkbox label="Checked In" v-model="info.checkedIn"></v-checkbox>
      </v-col>
      <v-col>
        <v-text-field
          label="Times Checked In"
          v-model.number="info.timesCheckedIn"
          type="number"
        ></v-text-field>
      </v-col>
      <!-- add update button -->
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { PropType } from "vue";
import { RowModes } from "~/interfaces";
import AttendeeModel from "~/models/AttendeeModel";
</script>

<script lang="ts">
export default defineNuxtComponent({
  props: {
    mode: {
      type: String as PropType<RowModes>,
      required: true,
    },
    rowIndex: Number,
    information: {
      type: Object as PropType<Prisma.Attendee>,
      required: false,
      default: {},
    },
  },
  data: () => ({
    info: {
      firstName: "",
      lastName: "",
      age: 0,
      gender: "Male",
      checkedIn: false,
    } as Prisma.Attendee,
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
    information: {
      handler() {
        console.log("heard information change");
        this.info = AttendeeModel.hydrateAttendee(this.information);
      },
      immediate: true,
      deep: true,
    },
  },
  emits: ["infoChange"],
});
</script>

<style></style>
