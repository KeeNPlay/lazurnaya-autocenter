<script setup lang="ts">
const links = useNavLinks()
const route = useRoute()
</script>

<template>
    <nav class="hidden md:flex items-center gap-x-6 2xl:gap-x-8">
        <NuxtLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ 'nav-link-active': route.path === link.path }"
        >
            {{ link.title }}
        </NuxtLink>
  </nav>
</template>