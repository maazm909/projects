<template>
  <v-data-table
    class="data-table"
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    hide-default-footer
  ></v-data-table>
</template>

<script lang="ts" setup>
import Prisma from "@prisma/client";
import { AlertTypes } from "@/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rows: [] as Prisma.Attendee[],
    headers: [
      { title: "ID", value: "id" },
      { title: "First Name", value: "firstName" },
      { title: "Last Name", value: "lastName" },
      { title: "Age", value: "age" },
      { title: "Gender", value: "gender" },
      { title: "# of Times Checked In", value: "timesCheckedIn" },
    ],
    updateResponse: "",
    alertType: undefined as AlertTypes,
  }),
  async created() {
    try {
      const response = await $fetch<Prisma.Attendee[]>("/api/getAttendees", {
        method: "POST",
        body: { query: "", model: "attendee" },
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
</style>
