<template>
  <div>
    <NuxtLayout>
      <v-app>
        <div class="flex-col container">
          <div class="flex-row gap-1 links">
            <RouterLink to="/">
              <v-btn>Home</v-btn>
            </RouterLink>
            <RouterLink to="/registration">
              <v-btn>Registration</v-btn>
            </RouterLink>
            <RouterLink to="/quranregistration">
              <v-btn>Quran Registration</v-btn>
            </RouterLink>
            <RouterLink to="/bazaar">
              <v-btn>Bazaar</v-btn>
            </RouterLink>
          </div>
          <NuxtPage />
        </div>
      </v-app>
    </NuxtLayout>
  </div>
</template>

<style>
.links {
  margin: 1rem;
}
.container {
  align-items: center;
}
</style>
