<template>
  <v-container>
    <v-row justify="center">
      <h1 class="">HOME PAGE</h1>
    </v-row>
    <v-row justify="center">
      <h1>ANALYTICS</h1>
    </v-row>
    <v-row justify="center">
      <v-list>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-title class="title">{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle class="subtitle">{{
            item.subtitle
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default defineNuxtComponent({
  data: () => ({
    items: [
      {
        title: 0,
        subtitle: "# of Lanyards Given Out",
        key: "lanyards",
      },
      {
        title: 0,
        subtitle: "# of People Checked In",
        key: "checkedIn",
      },
    ],
  }),
  async created() {
    try {
      const response = await $fetch<number>("/api/getAllExtraLanyards", {
        method: "GET",
      });
      this.items[0].title = response;
    } catch (error) {
      console.error(error);
    }
  },
});
</script>

<style scoped>
.title {
  color: rgb(0, 68, 14);
  font-weight: bold;
  font-size: 30px;
}
.subtitle {
  font-size: 20px;
  padding: 5px;
}
</style>
