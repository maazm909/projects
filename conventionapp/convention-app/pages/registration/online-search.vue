<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container fluid>
    <v-alert class="alert" :text="updateResponse" :type="alertType"></v-alert>
    <v-text-field v-model="search" label="Search" single-line></v-text-field>
    <v-data-table
      class="data-table"
      :headers="headers"
      :items="rows"
      :items-per-page="-1"
      :search="search"
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <v-text-field
          type="number"
          label="Check In Number"
          :max="item.totalTickets"
        ></v-text-field>
        <v-btn @click="updateTimesCheckedIn(item)">Check In</v-btn>
        <v-btn @click="incrementTimesCheckedIn(item)">Lost Lanyard</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { AlertTypes } from "@/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rows: [] as Prisma.OnlineGroup[],
    headers: [
      { title: "ID", value: "id" },
      { title: "First Name", value: "firstName" },
      { title: "Last Name", value: "lastName" },
      { title: "Age", value: "age" },
      { title: "Gender", value: "gender" },
      { title: "# of Times Checked In", value: "timesCheckedIn" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    updateResponse: "Placeholder for update response",
    alertType: undefined as AlertTypes,
    search: "",
    loading: false,
    isAlertOpen: false,
    isSnackbarOpen: true,
  }),
  methods: {
    async updateTimesCheckedIn(item: Prisma.OnlineGroup) {},
    async incrementTimesCheckedIn(item: Prisma.OnlineGroup) {
      const received = { ...item };
      this.updateResponse = "Placeholder for update response";
      this.loading = true;
      this.isAlertOpen = false;
      // find attendee by id
      const foundAttendee = this.attendeeById(received.id);
      if (!foundAttendee) {
        this.updateResponse = "Unable to find attendee match by id";
        this.alertType = "error";
        return;
      }
      received.timesCheckedIn += 1;
      // check if received info is same as current info, if so, don't send, set v alert message to same info
      // call update attendee, pass in info
      try {
        const response = await $fetch<Prisma.Attendee>("/api/updateAttendee", {
          method: "POST",
          body: { data: received },
        });
        // if good, set v alert message to success along with updated info
        Object.assign(foundAttendee, response);
        this.updateResponse =
          "update successful with info: " + JSON.stringify(foundAttendee);
        this.alertType = "success";
      } catch (error) {
        // if fail, set v alert message to error along with attempted updated info
        console.error(error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        this.updateResponse = "update failed with info: " + error.message;
        this.alertType = "error";
        return;
      } finally {
        this.loading = false;
        this.isAlertOpen = true;
      }
    },
    attendeeById(id: number): Prisma.OnlineGroup | undefined {
      const found = this.rows.find((attendee) => attendee.id === id);
      return found;
    },
  },
  async created() {
    try {
      const response = await $fetch<Prisma.OnlineGroup[]>("/api/getAttendees", {
        method: "POST",
        body: { query: "", model: "onlineGroup" },
      });
      this.rows = response;
    } catch (error) {
      console.error(error);
      this.updateResponse = "initial get all failed";
      this.alertType = "error";
    }
  },
});
</script>

<style>
.data-table {
  padding-left: 4rem;
  padding-right: 4rem;
}
.alert {
  margin-bottom: 2rem;
}
</style>
