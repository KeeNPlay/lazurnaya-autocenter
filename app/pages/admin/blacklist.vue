<script setup lang="ts">
import type { BlacklistCreatePayload, BlacklistEntry } from '~~/shared/utils/blacklist'

definePageMeta({
  layout: 'admin-panel'
})

const {
  currentPage,
  totalPages,
  entries,
  pending,
  isMutating,
  reload,
  addEntry,
  removeEntry
} = useAdminBlacklist()

const isCreateOpen = ref<boolean>(false)

const isUnblockOpen = ref<boolean>(false)
const unblockTarget = shallowRef<BlacklistEntry | null>(null)

function openCreate(): void {
  isCreateOpen.value = true
}

function openUnblock(entry: BlacklistEntry): void {
  unblockTarget.value = entry
  isUnblockOpen.value = true
}

// The modal closes only after a successful response — on an error (e.g. 409) the entered data is kept
async function onCreate(payload: BlacklistCreatePayload): Promise<void> {
  if (await addEntry(payload)) isCreateOpen.value = false
}

async function onConfirmUnblock(): Promise<void> {
  if (!unblockTarget.value) return

  await removeEntry(unblockTarget.value)
  // On an error (including 404) the list has already been refreshed, so there's no point in retrying
  isUnblockOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-y-6 px-2 md:px-6">
    <div class="flex items-center justify-between gap-x-3">
      <h1 class="ml-20 md:ml-0 text-base sm:text-lg lg:text-2xl font-medium text-white">Чёрный список</h1>

      <div class="flex items-center gap-x-3">
        <BaseButton aria-label="Добавить номер" title="Добавить номер" @click="openCreate">
          <template #icon-left>
            <Icon name="heroicons:plus-20-solid" />
          </template>
          <span class="max-[1280px]:hidden">Добавить номер</span>
        </BaseButton>

        <BaseButton variant="secondary" aria-label="Обновить список" :disabled="pending" @click="reload" class="lg:py-3.75 2xl:py-5.25">
          <Icon
              name="heroicons:arrow-path-20-solid"
              class="text-orange-800"
              :class="{ 'animate-spin': pending }"
          />
        </BaseButton>
      </div>
    </div>

    <AdminBlacklistTable :entries="entries" :loading="pending" @unblock="openUnblock" />

    <AdminRequestTablePagination v-model="currentPage" :total-pages="totalPages" />

    <AdminBlacklistCreateModal v-model="isCreateOpen" :saving="isMutating" @create="onCreate" />

    <AdminBlacklistUnblockDialog
        v-model="isUnblockOpen"
        :entry="unblockTarget"
        :loading="isMutating"
        @confirm="onConfirmUnblock"
    />
  </div>
</template>