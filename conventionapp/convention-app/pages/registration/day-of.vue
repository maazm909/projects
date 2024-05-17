<template>
  <v-container fluid>
    <v-row justify="center">
      <v-sheet width="100%">
        <v-form>
          <v-container class="row-container" fluid>
            <template v-for="n in rowCount" :key="n">
              <v-row>
                <AttendeeRow
                  mode="create-attendee"
                  class="attendee-row"
                  :row-index="n"
                  @info-change="updateInfo"
                />
              </v-row>
            </template>
            <v-row justify="center">
              <v-btn
                type="submit"
                :loading="loading"
                @click.prevent="pushToDatabase"
              >
                Submit
              </v-btn>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>
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
import {
  IAttendeeDataIndex,
  AlertTypes,
  IPrismaFetchResponse,
} from "@/interfaces";
import Prisma from "@prisma/client";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rowCount: 7,
    information: [] as IAttendeeDataIndex[],
    example: "",
    updateResponse: "",
    loading: false,
    alertType: undefined as AlertTypes,
    isAlertOpen: false,
  }),
  methods: {
    updateInfo(info: Prisma.Attendee, row: number) {
      const match = this.information.find((element) => element.index == row);
      if (match) {
        match.data = info;
      } else {
        this.information.push({ index: row, data: info });
      }
    },
    async pushToDatabase() {
      this.updateResponse = "";
      this.loading = true;
      try {
        for (const row of this.information) {
          if (row.data.firstName != "" && row.data.lastName != "") {
            try {
              const response = await $fetch<IPrismaFetchResponse>(
                "/api/addRow",
                {
                  method: "POST",
                  body: row,
                },
              );
              if (response.status === "success") {
                console.log("write successful");
                this.updateResponse +=
                  "write successful, " + response.info + "\n";
                this.alertType = "success";
              } else {
                console.error("write failed");
                this.updateResponse = "write failed";
                this.alertType = "error";
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      } finally {
        this.loading = false;
        this.isAlertOpen = true;
      }
    },
  },
  async mounted() {},
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
