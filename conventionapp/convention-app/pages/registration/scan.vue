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
        </v-container>
      </v-form>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    ticketInfo: {
      ticketNumbers: [1, 2, 3] as Array<number>,
      ticketPrice: 0 as number,
      alreadyPaid: true as boolean,
    },
    fieldValue: "",
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
  methods: {},
  watch: {
    fieldValue(value: string) {
      if (value.length === 6 && !isNaN(parseInt(value))) {
        this.ticketInfo.ticketNumbers.push(parseInt(value));
        this.fieldValue = "";
      }
    },
  },
});
</script>

<style>
.ticket-form {
  width: 30%;
}
</style>
