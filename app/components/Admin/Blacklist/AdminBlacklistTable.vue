<script setup lang="ts">
import type { BlacklistEntry } from '~~/shared/utils/blacklist'

const props = withDefaults(
    defineProps<{
      entries: readonly BlacklistEntry[]
      loading?: boolean
    }>(),
    { loading: false }
)

const emit = defineEmits<{
  unblock: [entry: BlacklistEntry]
}>()

// id + дата добавления + телефон + причина + действия
const COLUMNS_COUNT = 5 as const

const emptyText = computed<string>(() =>
    props.loading && props.entries.length === 0 ? 'Загрузка...' : 'Чёрный список пуст'
)
</script>

<template>
  <div>
    <!-- Десктоп: таблица -->
    <div class="hidden overflow-x-auto rounded-md border border-gray-150 lg:block">
      <table class="w-full text-left text-sm">
        <thead>
        <tr class="bg-gray-150 text-gray-900 font-medium">
          <th class="px-4 py-4">id</th>
          <th class="px-4 py-4">Дата добавления</th>
          <th class="px-4 py-4">Телефон</th>
          <th class="px-4 py-4">Причина</th>
          <th class="px-4 py-4 text-right">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="entries.length === 0">
          <td :colspan="COLUMNS_COUNT" class="px-4 py-8 text-center text-gray-400">
            {{ emptyText }}
          </td>
        </tr>

        <tr
            v-for="entry in entries"
            v-else
            :key="entry.id"
            class="border-b border-gray-150 transition-colors duration-150 hover:bg-gray-150/30"
        >
          <td class="whitespace-nowrap px-4 py-3 text-gray-400">{{ entry.id }}</td>
          <td class="whitespace-nowrap px-4 py-3">{{ entry.addedAt }}</td>
          <td class="whitespace-nowrap px-4 py-3">{{ formatPhone(entry.phone) }}</td>
          <td class="max-w-md px-4 py-3">
            <p
                v-if="entry.reason"
                class="line-clamp-2 break-words"
                :title="entry.reason"
            >
              {{ entry.reason }}
            </p>
            <span v-else class="text-gray-500">—</span>
          </td>
          <td class="px-4 py-3 text-right">
            <button
                type="button"
                class="text-orange-500 cursor-pointer hover:underline"
                @click="emit('unblock', entry)"
            >
              Разблокировать
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Мобильные устройства: карточки -->
    <div class="flex flex-col gap-y-3 lg:hidden">
      <p
          v-if="entries.length === 0"
          class="rounded-md border border-gray-150 px-4 py-8 text-center text-gray-400"
      >
        {{ emptyText }}
      </p>

      <div
          v-for="entry in entries"
          v-else
          :key="entry.id"
          class="flex flex-col gap-y-3 rounded-md border border-gray-150 p-4"
      >
        <span class="font-medium text-white">
          <span class="mr-1 text-gray-400">№{{ entry.id }}</span>
          {{ entry.addedAt }}
        </span>

        <dl class="flex flex-col gap-y-1 text-sm">
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Телефон</dt>
            <dd class="text-right text-white">{{ formatPhone(entry.phone) }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Причина</dt>
            <dd class="whitespace-pre-line break-words text-right text-white">{{ entry.reason || '—' }}</dd>
          </div>
        </dl>

        <div class="flex justify-end border-t border-gray-150 pt-3">
          <button
              type="button"
              class="text-sm text-orange-500 cursor-pointer hover:underline"
              @click="emit('unblock', entry)"
          >
            Разблокировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>