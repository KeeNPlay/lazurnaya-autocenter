<script setup lang="ts">
import { ADMIN_HOME_PATH } from '~/constants/adminNav'

definePageMeta({
  middleware: 'admin-guest',
  layout: 'admin-login',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const { login } = useAdminAuth()

const form = reactive({
  login: '',
  password: ''
})

const isSubmitting = ref<boolean>(false)
const error = ref<string>('')

async function onSubmit(): Promise<void> {
  error.value = ''
  isSubmitting.value = true

  try {
    const success = await login({ login: form.login, password: form.password })

    if (!success) {
      error.value = 'Неверный логин или пароль'
      return
    }

    await navigateTo(ADMIN_HOME_PATH)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <div class="hidden md:flex lg:col-span-2 relative h-screen items-center justify-center border border-gray-150 overflow-hidden">
      <NuxtImg
        src="images/contacts_logo_bg.jpg"
        format="webp"
        quality="80"
        aria-hidden="true"
        alt=""
        fit="cover"
        class="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        loading="eager"
        fetchpriority="high"
      />

      <div class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-linear-to-r from-transparent via-orange-500 to-transparent" />
      <div class="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-orange-500 to-transparent" />

      <div class="absolute top-1/2 left-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-950/30 blur-3xl" />

      <div class="absolute inset-0 bg-orange-500/20 pointer-events-none mix-blend-color"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <AppLogo 
          variant="glow"
          size="xl"
        />
        
      </div>
    </div>
    <div class="flex min-h-screen flex-col  gap-y-4 md:gap-y-6 2xl:gap-y-10 items-center justify-center p-7.5 lg:p-10 2xl:p-12.5">
      <form class="flex flex-col w-full gap-y-6 md:gap-y-10 2xl:gap-y-15" @submit.prevent="onSubmit">
        <h1 class="text-center text-xl font-medium text-white">Админ-панель</h1>

        <BaseFormField label="Логин" required>
          <BaseFormInput v-model="form.login" required />
        </BaseFormField>

        <BaseFormField label="Пароль" required>
          <BaseFormInput v-model="form.password" type="password" required />
        </BaseFormField>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <BaseFormSubmit :loading="isSubmitting">Войти</BaseFormSubmit>
      
      </form>
      <NuxtLink to="/" class="flex items-center gap-x-1 text-sm 2xl:text-lg text-gray-400 hover:text-white transition-colors duration-200">
        <Icon class="mt-0.5" name="heroicons:arrow-left-20-solid" />
        Вернуться на сайт
      </NuxtLink>
    </div>
  </div>
  
  
</template>