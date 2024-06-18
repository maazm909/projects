<template>
  <div>
    <div class="flex-col container">
      <div class="flex-row gap-1 links">
        <RouterLink to="/">
          <v-btn>Home</v-btn>
        </RouterLink>
        <RouterLink to="/registration">
          <v-btn>Registration</v-btn>
        </RouterLink>
        <RouterLink to="/bazaar">
          <v-btn>Bazaar</v-btn>
        </RouterLink>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style>
.links {
  margin: 1rem;
}
.container {
  align-items: center;
}
</style>
