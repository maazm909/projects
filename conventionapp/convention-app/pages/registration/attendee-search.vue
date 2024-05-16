<template>
  <v-container fluid>
    <template v-for="(row, index) in currentData" :key="row">
      <AttendeeRow
        :information="row"
        :row-index="index"
        @info-change="updateInfo"
      />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { alertTypes } from "~/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    //...
    currentData: [] as Prisma.Attendee[],
    updateResponse: "",
    loading: false,
    alertType: undefined as alertTypes,
    isAlertOpen: false,
  }),
  methods: {
    updateInfo(info: Prisma.Attendee, row: number) {
      if (this.currentData[row].checkedIn != info.checkedIn) {
        // update database, flip checkedIn based on id
      }
    },
  },
  created() {
    // get all attendees, load them into currentData
  },
});
</script>

<style></style>
