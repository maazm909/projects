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
      :loading="loading"
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <v-row class="actions-row" align="center">
          How Many Checking In?
          <v-text-field
            class="mr-2 pa-10"
            type="number"
            label="Check In Number"
            min-width="10rem"
            :max="item.totalTickets"
            :ref="'el-' + item.id"
            @input="handleTimesInput(item.id, $event)"
          ></v-text-field>
          <v-btn class="mr-2" @click="updateTimesCheckedIn(item)"
            >Check In</v-btn
          >
          <v-btn class="mr-2" @click="incrementExtraLanyards(item)"
            >Lost Lanyard</v-btn
          >
        </v-row>
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
      { title: "Email", value: "email" },
      { title: "Total Number of Tickets", value: "totalTickets" },
      { title: "# of Times Checked In", value: "timesCheckedIn" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    timesCheckedInValues: {} as Record<number, number>,
    updateResponse: "Placeholder for update response",
    alertType: undefined as AlertTypes,
    search: "",
    loading: false,
    isAlertOpen: false,
    isSnackbarOpen: true,
  }),
  methods: {
    getTimesCheckedIn(id: number) {
      return this.timesCheckedInValues[id] || 0; //
    },
    handleTimesInput(id: number, event: Event) {
      const el = event.target as HTMLInputElement;
      this.timesCheckedInValues[id] = Number(el.value);
    },
    async updateTimesCheckedIn(item: Prisma.OnlineGroup) {
      const received = { ...item };
      this.updateResponse = "Placeholder for update response";
      this.alertType = undefined as AlertTypes;
      this.loading = true;
      this.isAlertOpen = false;
      // find attendee by id
      const foundAttendee = this.attendeeById(received.id);
      if (!foundAttendee) {
        this.updateResponse = "Unable to find attendee match by id";
        this.alertType = "error";
        return;
      }
      // TODO: instead of 1, use ref to get value of text field
      if (
        received.timesCheckedIn + this.timesCheckedInValues[received.id] >
        received.totalTickets
      ) {
        this.updateResponse =
          "Unable to check in more than the total number of tickets";
        this.alertType = "error";
        this.loading = false;
        this.isAlertOpen = true;
        return;
      }
      received.timesCheckedIn += this.timesCheckedInValues[received.id];
      // check if received info is same as current info, if so, don't send, set v alert message to same info
      // call update attendee, pass in info
      try {
        const response = await $fetch<Prisma.OnlineGroup>("/api/updateOnline", {
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
    async incrementExtraLanyards(item: Prisma.OnlineGroup) {
      const received = { ...item };
      this.updateResponse = "Placeholder for update response";
      this.alertType = undefined as AlertTypes;
      this.loading = true;
      this.isAlertOpen = false;
      // find attendee by id
      const foundAttendee = this.attendeeById(received.id);
      if (!foundAttendee) {
        this.updateResponse = "Unable to find attendee match by id";
        this.alertType = "error";
        return;
      }
      received.extraLanyards += 1;
      // check if received info is same as current info, if so, don't send, set v alert message to same info
      // call update attendee, pass in info
      try {
        const response = await $fetch<Prisma.OnlineGroup>("/api/updateOnline", {
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
    this.loading = true;
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
    } finally {
      this.loading = false;
    }
  },
});
</script>

<style scoped>
.data-table {
  padding-left: 4rem;
  padding-right: 4rem;
}
.alert {
  margin-bottom: 2rem;
}
.actions-row {
  flex-wrap: nowrap;
}
</style>
