<script setup lang="ts">
import type { AdminRequest, RequestStatus, RequestType } from '~/types/request'
import { CAR_TYPE_LABELS, WASH_TYPE_LABELS } from '~/types/request'

const props = defineProps<{
  requests: readonly AdminRequest[]
  type: RequestType
}>()

const emit = defineEmits<{
  view: [request: AdminRequest]
  updateStatus: [id: number, status: RequestStatus]
}>()

const isWashing = computed<boolean>(() => props.type === 'washing')
const columnsCount = computed<number>(() => (isWashing.value ? 7 : 5))
</script>

<template>
  <div>
    <!-- Десктоп: таблица -->
    <div class="hidden overflow-x-auto rounded-md border border-gray-150 lg:block">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-150 bg-gray-150/30 text-gray-400">
            <th class="px-4 py-3 font-medium">Дата / Время</th>
            <th class="px-4 py-3 font-medium">Клиент</th>
            <th class="px-4 py-3 font-medium">Телефон</th>
            <th v-if="isWashing" class="px-4 py-3 font-medium">Тип мойки</th>
            <th v-if="isWashing" class="px-4 py-3 font-medium">Тип авто</th>
            <th class="px-4 py-3 font-medium">Статус</th>
            <th class="px-4 py-3 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="requests.length === 0">
            <td :colspan="columnsCount" class="px-4 py-8 text-center text-gray-400">
              Заявок не найдено
            </td>
          </tr>

          <tr
            v-for="request in requests"
            v-else
            :key="request.id"
            class="border-b border-gray-150 transition-colors duration-150 hover:bg-gray-150/30"
          >
            <td class="whitespace-nowrap px-4 py-3">{{ request.date }} {{ request.time }}</td>
            <td class="px-4 py-3">{{ request.nameOrCompany }}</td>
            <td class="whitespace-nowrap px-4 py-3">{{ request.phone }}</td>
            <td v-if="request.type === 'washing'" class="whitespace-nowrap px-4 py-3">
              {{ WASH_TYPE_LABELS[request.washType] }}
            </td>
            <td v-if="request.type === 'washing'" class="whitespace-nowrap px-4 py-3">
              {{ CAR_TYPE_LABELS[request.carType] }}
            </td>
            <td class="px-4 py-3">
              <AdminRequestStatusBadge :status="request.status" />
            </td>
            <td class="px-4 py-3 text-right" @click.stop>
              <div class="flex justify-end gap-x-3">
                <button
                  v-if="request.status === 'active'"
                  type="button"
                  class="text-orange-500 cursor-pointer hover:underline"
                  @click="emit('view', request)"
                >
                  Изменить
                </button>
                <button
                  v-if="request.status === 'active'"
                  type="button"
                  class="text-red-500 cursor-pointer hover:underline"
                  @click="emit('updateStatus', request.id, 'cancelled')"
                >
                  Отменить
                </button>
                <span v-if="request.status !== 'active'" class="text-gray-500">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Мобильные устройства: карточки -->
    <div class="flex flex-col gap-y-3 lg:hidden">
      <p
        v-if="requests.length === 0"
        class="rounded-md border border-gray-150 px-4 py-8 text-center text-gray-400"
      >
        Заявок не найдено
      </p>

      <div
        v-for="request in requests"
        v-else
        :key="request.id"
        class="flex cursor-pointer flex-col gap-y-3 rounded-md border border-gray-150 p-4"
        @click="emit('view', request)"
      >
        <div class="flex items-start justify-between gap-x-3">
          <span class="font-medium text-white">{{ request.date }} {{ request.time }}</span>
          <AdminRequestStatusBadge :status="request.status" />
        </div>

        <dl class="flex flex-col gap-y-1 text-sm">
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Клиент</dt>
            <dd class="text-right text-white">{{ request.nameOrCompany }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Телефон</dt>
            <dd class="text-right text-white">{{ request.phone }}</dd>
          </div>
          <template v-if="request.type === 'washing'">
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Тип мойки</dt>
              <dd class="text-right text-white">{{ WASH_TYPE_LABELS[request.washType] }}</dd>
            </div>
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Тип авто</dt>
              <dd class="text-right text-white">{{ CAR_TYPE_LABELS[request.carType] }}</dd>
            </div>
          </template>
        </dl>

        <div
          v-if="request.status === 'active'"
          class="flex justify-end gap-x-3 border-t border-gray-150 pt-3"
          @click.stop
        >
          <button type="button" class="text-sm text-orange-500 hover:underline" @click="emit('view', request)">
            Изменить
          </button>
          <button
            type="button"
            class="text-sm text-red-500 hover:underline"
            @click="emit('updateStatus', request.id, 'cancelled')"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>