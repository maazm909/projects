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
          label="Phone Number"
          v-model="info.phoneNumber"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Number of Attendees"
          type="number"
          v-model.number="info.timesCheckedIn"
        ></v-text-field>
      </v-col>
      <v-col v-if="mode === 'search-online'">
        <v-checkbox label="Checked In" v-model="info.checkedIn"></v-checkbox>
      </v-col>
      <v-col
        v-if="
          ['search-attendee', 'search-quran', 'search-online'].includes(mode)
        "
      >
        <v-text-field
          label="Times Checked In"
          v-model.number="info.timesCheckedIn"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col
        v-if="
          ['search-attendee', 'search-quran', 'search-online'].includes(mode)
        "
      >
        <v-btn @click="updateClicked">Update</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { PropType } from "vue";
import { RowModes } from "@/interfaces";
import AttendeeModel from "@/models/AttendeeModel";
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
      phoneNumber: "",
      timesCheckedIn: 0,
      checkedIn: false,
    } as Prisma.Attendee,
    rules: [
      (value: string) => {
        if (value) return true;

        return "You must enter a first name.";
      },
    ],
  }),
  methods: {
    updateClicked() {
      this.$emit("updateClicked", this.info, this.rowIndex);
    },
  },
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
  emits: ["infoChange", "updateClicked"],
});
</script>

<style></style>
