<!-- Ticket number, prepaid or in person, ticket price -->
<template>
  <v-container class="align-center justify-center">
    <v-row justify="center">
      <!-- v-for ticketNumbers, make cards that can be deleted -->
      <v-chip
        v-for="t in ticketInfo.ticketNumbers"
        :key="t"
        class="mx-1"
        size="x-large"
        closable
        @click:close="
          ticketInfo.ticketNumbers = ticketInfo.ticketNumbers.filter(
            (x) => x != t,
          )
        "
      >
        {{ t }}
      </v-chip>
    </v-row>
    <v-row justify="center">
      <v-form class="ticket-form">
        <v-container>
          <v-row>
            <v-text-field v-model="fieldValue" :rules="rules"></v-text-field>
          </v-row>
          <v-row>
            <h2>Already Paid?</h2>
          </v-row>
          <v-row>
            <v-radio-group inline v-model="ticketInfo.alreadyPaid">
              <v-radio :value="true" label="Yes"></v-radio>
              <v-radio :value="false" label="No"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row>
            <h2>Price</h2>
          </v-row>
          <v-row>
            <v-radio-group
              inline
              @update:model-value="
                (value: any) => {
                  if (value === -1) {
                    customPriceOpen = true;
                  } else {
                    customPriceOpen = false;
                  }
                  ticketInfo.ticketPrice = value;
                }
              "
            >
              <v-radio :value="30" label="30"></v-radio>
              <v-radio :value="25" label="25"></v-radio>
              <v-radio :value="20" label="20"></v-radio>
              <v-radio :value="0" label="Family"></v-radio>
              <v-radio :value="-1" label="Custom Price"></v-radio>
              <v-text-field
                class="custom-price-field ml-4"
                type="number"
                v-if="customPriceOpen"
                v-model.number="customPrice"
              ></v-text-field>
            </v-radio-group>
          </v-row>
          <v-row justify="center">
            <v-btn
              type="submit"
              :loading="loading"
              @click.prevent="pushToDatabase()"
              >Submit</v-btn
            >
          </v-row>
        </v-container>
      </v-form>
    </v-row>
    <v-row class="my-8">
      <v-alert
        v-model="isAlertOpen"
        :text="updateResponse"
        class="multi-line"
        :type="alertType"
        closable
      ></v-alert>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { AlertTypes, IPrismaFetchResponse } from "~/interfaces";
</script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    ticketInfo: {
      ticketNumbers: [] as Array<number>,
      ticketPrice: 0 as number,
      alreadyPaid: true as boolean,
    },
    loading: false,
    alertType: undefined as AlertTypes,
    isAlertOpen: false,
    updateResponse: "",
    fieldValue: "",
    customPrice: 0 as number,
    customPriceOpen: false as boolean,
    rules: [
      (value: string) => {
        if (value.length < 6) {
          return "Ticket number must be a length of 6";
        }
        if (isNaN(parseInt(value))) {
          return "Ticket number must be a number";
        }
        return true;
      },
    ],
  }),
  methods: {
    async pushToDatabase() {
      this.updateResponse = "";
      this.loading = true;
      try {
        for (const ticket of this.ticketInfo.ticketNumbers) {
          try {
            const response = await $fetch<IPrismaFetchResponse>(
              "/api/addTicket",
              {
                method: "POST",
                body: {
                  ticketNum: ticket,
                  ticketPrice: this.ticketInfo.ticketPrice,
                  alreadyPaid: this.ticketInfo.alreadyPaid,
                },
              },
            );
            if (response.status === "success") {
              console.log("write successful");
              this.updateResponse +=
                "write successful, " + response.info + "\n";
              this.alertType = "success";
            } else {
              console.error("write failed");
              this.updateResponse += "write failed, " + response.info + "\n";
              this.alertType = "error";
            }
          } catch (error) {
            console.error(error);
          }
        }
      } finally {
        this.ticketInfo.ticketNumbers = [];
        this.loading = false;
        this.isAlertOpen = true;
      }
    },
  },
  watch: {
    fieldValue(value: string) {
      if (value.length === 6 && !isNaN(parseInt(value))) {
        this.ticketInfo.ticketNumbers.push(parseInt(value));
        this.fieldValue = "";
      }
    },
    customPrice(value: number) {
      this.ticketInfo.ticketPrice = value;
    },
  },
});
</script>

<style>
.ticket-form {
  width: 30%;
}
.multi-line {
  white-space: pre-line;
}
</style>
