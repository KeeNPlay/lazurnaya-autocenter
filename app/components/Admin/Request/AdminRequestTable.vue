<script setup lang="ts">
import type { AdminRequest, RequestStatus, RequestType } from '~/types/request'
import { VEHICLE_TYPE_LABELS, WASH_TYPE_LABELS } from '~/types/request'

const props = withDefaults(
    defineProps<{
      requests: readonly AdminRequest[]
      type: RequestType
      loading?: boolean
    }>(),
    { loading: false }
)

const emit = defineEmits<{
  view: [request: AdminRequest]
  updateStatus: [id: number, status: RequestStatus]
}>()

const isInspection = computed<boolean>(() => props.type === 'inspection')
const isWashing = computed<boolean>(() => props.type === 'washing')
const isTransportation = computed<boolean>(() => props.type === 'transportation')

// id + дата + клиент + телефон + 2 специфичные колонки + статус + действия
const COLUMNS_COUNT = 8 as const

const emptyText = computed<string>(() =>
    props.loading && props.requests.length === 0 ? 'Загрузка...' : 'Заявок не найдено'
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
          <th class="px-4 py-4">{{ isTransportation ? 'Дата отправления' : 'Дата / Время' }}</th>
          <th class="px-4 py-4">Клиент</th>
          <th class="px-4 py-4">Телефон</th>
          <th v-if="isInspection" class="px-4 py-4">Марка</th>
          <th v-if="isInspection" class="px-4 py-4">Гос. номер</th>
          <th v-if="isWashing" class="px-4 py-4">Тип мойки</th>
          <th v-if="isWashing" class="px-4 py-4">Тип авто</th>
          <th v-if="isTransportation" class="px-4 py-4">Откуда</th>
          <th v-if="isTransportation" class="px-4 py-4">Куда</th>
          <th class="px-4 py-4 text-center">Статус</th>
          <th class="px-4 py-4 text-right">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="requests.length === 0">
          <td :colspan="COLUMNS_COUNT" class="px-4 py-8 text-center text-gray-400">
            {{ emptyText }}
          </td>
        </tr>

        <tr
            v-for="request in requests"
            v-else
            :key="request.id"
            class="border-b border-gray-150 transition-colors duration-150 hover:bg-gray-150/30"
        >
          <td class="whitespace-nowrap px-4 py-3 text-gray-400">{{ request.id }}</td>
          <td class="whitespace-nowrap px-4 py-3">
            <template v-if="request.type === 'transportation'">{{ request.departureDate }}</template>
            <template v-else>{{ request.date }} {{ request.time }}</template>
          </td>
          <td class="px-4 py-3">{{ request.nameOrCompany }}</td>
          <td class="whitespace-nowrap px-4 py-3">{{ formatPhone(request.phone) }}</td>
          <td v-if="request.type === 'inspection'" class="px-4 py-3">{{ request.carBrand }}</td>
          <td v-if="request.type === 'inspection'" class="whitespace-nowrap px-4 py-3">{{ request.plateNumber }}</td>
          <td v-if="request.type === 'washing'" class="px-4 py-3">
            {{ WASH_TYPE_LABELS[request.washType] }}
          </td>
          <td v-if="request.type === 'washing'" class="px-4 py-3">
            {{ VEHICLE_TYPE_LABELS[request.vehicleType] }}
          </td>
          <td v-if="request.type === 'transportation'" class="px-4 py-3">{{ request.fromCity }}</td>
          <td v-if="request.type === 'transportation'" class="px-4 py-3">{{ request.toCity }}</td>
          <td class="px-4 py-3 text-center">
            <AdminRequestStatusBadge :status="request.status" />
          </td>
          <td class="px-4 py-3 text-right" @click.stop>
            <div class="flex justify-end gap-x-3">
              <template v-if="request.type === 'transportation'">
                <button type="button" class="text-orange-500 cursor-pointer hover:underline" @click="emit('view', request)">
                  Подробнее
                </button>
                <button
                    v-if="request.status === 'active'"
                    type="button"
                    class="text-red-500 cursor-pointer hover:underline"
                    @click="emit('updateStatus', request.id, 'completed')"
                >
                  Завершить
                </button>
              </template>
              <template v-else>
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
              </template>
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
        {{ emptyText }}
      </p>

      <div
          v-for="request in requests"
          v-else
          :key="request.id"
          class="flex flex-col gap-y-3 rounded-md border border-gray-150 p-4"
      >
        <div class="flex items-start justify-between gap-x-3">
          <span class="font-medium text-white">
            <span class="text-gray-400 mr-1">№{{ request.id }}</span>
            <span class="text-gray-400 mr-1">№{{ request.id }}</span>
            <template v-if="request.type === 'transportation'"> {{ request.departureDate }}</template>
            <template v-else> {{ request.date }} {{ request.time }}</template>
          </span>
          <AdminRequestStatusBadge :status="request.status" />
        </div>

        <dl class="flex flex-col gap-y-1 text-sm">
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Клиент</dt>
            <dd class="text-right text-white">{{ request.nameOrCompany }}</dd>
          </div>
          <div class="flex justify-between gap-x-3">
            <dt class="text-gray-400">Телефон</dt>
            <dd class="text-right text-white">{{ formatPhone(request.phone) }}</dd>
          </div>
          <template v-if="request.type === 'inspection'">
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Марка</dt>
              <dd class="text-right text-white">{{ request.carBrand }}</dd>
            </div>
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Гос. номер</dt>
              <dd class="text-right text-white">{{ request.plateNumber }}</dd>
            </div>
          </template>
          <template v-else-if="request.type === 'washing'">
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Тип мойки</dt>
              <dd class="text-right text-white">{{ WASH_TYPE_LABELS[request.washType] }}</dd>
            </div>
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Тип авто</dt>
              <dd class="text-right text-white">{{ VEHICLE_TYPE_LABELS[request.vehicleType] }}</dd>
            </div>
          </template>
          <template v-else-if="request.type === 'transportation'">
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Откуда</dt>
              <dd class="text-right text-white">{{ request.fromCity }}</dd>
            </div>
            <div class="flex justify-between gap-x-3">
              <dt class="text-gray-400">Куда</dt>
              <dd class="text-right text-white">{{ request.toCity }}</dd>
            </div>
          </template>
        </dl>

        <div
            v-if="request.type === 'transportation' || request.status === 'active'"
            class="flex justify-end gap-x-3 border-t border-gray-150 pt-3"
            @click.stop
        >
          <template v-if="request.type === 'transportation'">
            <button type="button" class="text-sm text-orange-500 cursor-pointer hover:underline" @click="emit('view', request)">
              Подробнее
            </button>
            <button
                v-if="request.status === 'active'"
                type="button"
                class="text-sm text-red-500 cursor-pointer hover:underline"
                @click="emit('updateStatus', request.id, 'completed')"
            >
              Завершить
            </button>
          </template>
          <template v-else>
            <button type="button" class="text-sm text-orange-500 cursor-pointer hover:underline" @click="emit('view', request)">
              Изменить
            </button>
            <button
                type="button"
                class="text-sm text-red-500 cursor-pointer hover:underline"
                @click="emit('updateStatus', request.id, 'cancelled')"
            >
              Отменить
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>