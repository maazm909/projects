<template>
  <v-container fluid>
    <v-row justify="center">
      <v-sheet width="100%">
        <v-form>
          <v-container fluid>
            <template v-for="n in rowCount" :key="n">
              <v-row>
                <AttendeeRow :row-index="n" @info-change="updateInfo" />
              </v-row>
            </template>
            <v-row justify="center">
              <v-btn type="submit" @click.prevent="pushToDatabase">
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
          <v-alert closable>{{ updateResponse }}</v-alert>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { type IAttendeeDataIndex, type IAddRowResponse } from "@/interfaces";
import Prisma from "@prisma/client";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    rowCount: 3,
    information: [] as IAttendeeDataIndex[],
    example: "",
    updateResponse: "",
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
      for (const row of this.information) {
        if (row.data.firstName != "" && row.data.lastName != "") {
          try {
            const response = await $fetch<IAddRowResponse>("/api/addRow", {
              method: "POST",
              body: row,
            });
            if (response.status === "success") {
              console.log("write successful");
              this.updateResponse = "write successful";
            } else {
              console.error("write failed");
              this.updateResponse = "write failed";
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    },
  },
  async mounted() {},
});
</script>

<style></style>
