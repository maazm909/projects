<template>
  <v-container fluid>
    <template v-for="(row, index) in currentData" :key="row">
      <AttendeeRow
        mode="search-attendee"
        :information="row"
        :row-index="index"
        @info-change="updateInfo"
      />
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { IPrismaFetchResponse, AlertTypes } from "~/interfaces";
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
    async updateInfo(info: Prisma.Attendee) {
      const foundAttendee = this.attendeeById(info.id);
      if (
        foundAttendee &&
        info.timesCheckedIn !== foundAttendee.timesCheckedIn
      ) {
        const payload = { id: info.id, timesCheckedIn: info.timesCheckedIn };
        try {
          const response = await $fetch<IPrismaFetchResponse>(
            "/api/updateAttendee",
            {
              method: "POST",
              body: payload,
            },
          );
          if (response.status === "success") {
            console.log("write successful");
            this.updateResponse += "write successful, " + response.info + "\n";
            this.alertType = "success";
          } else {
            console.error(response);
            this.updateResponse = "write failed";
            this.alertType = "error";
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.loading = false;
          this.isAlertOpen = true;
        }
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
        body: { query: "" },
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

<style></style>
