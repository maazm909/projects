<template>
  <v-container fluid>
    <v-row justify="center">
      <v-sheet width="100%">
        <v-form>
          <v-container class="row-container" fluid>
            <template v-for="i in 1" :key="i">
              <v-row>
                <AttendeeRow
                  mode="create-attendee"
                  class="attendee-row"
                  :row-index="i"
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
  AlertTypes,
  IPrismaFetchResponse,
  ITicketHolderDataIndex,
} from "@/interfaces";
import Prisma from "@prisma/client";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rowCount: 7,
    information: [] as ITicketHolderDataIndex[],
    example: "",
    updateResponse: "",
    loading: false,
    alertType: undefined as AlertTypes,
    isAlertOpen: false,
  }),
  methods: {
    updateInfo(info: Prisma.TicketHolder, row: number) {
      console.log(row);
      const match = this.information.find((element) => element.index == row);
      if (match) {
        match.data = info;
      } else {
        this.information.push({ index: row, data: info });
      }
      if (row === 0) {
        console.log("in row 1");
        for (let i = 0; i < this.rowCount; i++) {
          const match = this.information.find((element) => element.index == i);
          if (match) {
            match.data.lastName = info.lastName;
          } else {
            this.information.push({
              index: i,
              data: {
                ...info,
                lastName: info.lastName,
              },
            });
          }
        }
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
                "/api/addTicketHolder",
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
