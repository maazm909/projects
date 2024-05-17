<template>
  <div class="flex-col justify-center container">
    <h1>REGISTRATION</h1>
    <div class="flex-row gap-1 links">
      <RouterLink to="/registration/day-of">
        <v-btn>Day Of</v-btn>
      </RouterLink>
      <RouterLink to="/registration/attendee-search">
        <v-btn>Day Of Search</v-btn>
      </RouterLink>
      <RouterLink to="/registration/online">
        <v-btn>Online</v-btn>
      </RouterLink>
      <RouterLink to="/registration/scan">
        <v-btn>Scan Tickets</v-btn>
      </RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
