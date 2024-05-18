<template>
  <v-container fluid>
    <template v-for="(row, index) in currentData" :key="row">
      <AttendeeRow
        mode="search-attendee"
        class="attendee-row"
        :information="row"
        :row-index="index"
        @update-clicked="updateClicked"
      />
    </template>
    <v-row v-if="loading">
      <v-col>
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="error-container">
          <v-alert
            v-model="isAlertOpen"
            :text="updateResponse"
            class="multi-line"
            :type="alertType"
            closable
          ></v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { AlertTypes } from "~/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    //...
    currentData: [] as Prisma.Attendee[],
    updateResponse: "",
    loading: false,
    alertType: undefined as AlertTypes,
    isAlertOpen: false,
  }),
  methods: {
    async updateClicked(info: Prisma.Attendee) {
      this.updateResponse = "";
      this.loading = true;
      this.isAlertOpen = false;
      // find attendee by id
      const foundAttendee = this.attendeeById(info.id);
      if (!foundAttendee) {
        this.updateResponse = "Unable to find attendee match by id";
        this.alertType = "error";
        return;
      }
      // check if received info is same as current info, if so, don't send, set v alert message to same info
      if (JSON.stringify(foundAttendee) == JSON.stringify(info)) {
        this.updateResponse =
          "No change in info, please change before updating";
        return;
      }
      // call update attendee, pass in info
      try {
        const response = await $fetch<Prisma.Attendee>("/api/updateAttendee", {
          method: "POST",
          body: { data: info },
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
    attendeeById(id: number): Prisma.Attendee | undefined {
      const found = this.currentData.find((attendee) => attendee.id === id);
      return found;
    },
  },
  async created() {
    try {
      const response = await $fetch<Prisma.Attendee[]>("/api/getAttendees", {
        method: "POST",
        body: { query: "", model: "attendee" },
      });
      this.currentData = response;
    } catch (error) {
      console.error(error);
      this.updateResponse = "initial get all failed";
      this.alertType = "error";
    }
  },
});
</script>

<style>
.multi-line {
  white-space: pre-line;
}
.attendee-row {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
