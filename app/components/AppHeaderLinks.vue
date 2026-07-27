<script setup lang="ts">
const links = useNavLinks()
</script>

<template>
    <nav class="items-center gap-x-6 2xl:gap-x-8">
        <NuxtLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            active-class="nav-link-active"
        >
            {{ link.title }}
        </NuxtLink>
  </nav>
</template>