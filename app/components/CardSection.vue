<script setup lang="ts">

interface IService {
  title: string
  description: string
  icon: string
  link?: string
}

const services: IService[] = [
  {
    title: 'Гостехосмотр',
    description:
      'Осуществляем официальный государственный технический осмотр в Республике Беларусь для всех видов транспорта в строгом соответствии с действующим законодательством и нормативными требованиями, обеспечивая прозрачность, точность и объективность проведения проверки.',
    icon: 'heroicons:identification-20-solid',
    link: '/inspection',
  },
  {
    title: 'Мойка',
    description: 'Предоставляем профессиональные услуги по мойке грузовых автомобилей, спецтехники и автобусов с использованием современного оборудования и эффективных моющих средств. Качественная мойка не только улучшает внешний вид транспорта, но и продлевает срок его службы, предотвращая коррозию и повреждения.',
    icon: 'heroicons:sparkles-20-solid',
    link: '/washing',
  },
  {
    title: 'Международные перевозки',
    description: 'Осуществляем международные перевозки грузов, обеспечивая надежную и своевременную доставку по различным направлениям. Тщательно контролируем каждый этап перевозки — от подготовки документов до прибытия груза в пункт назначения.',
    icon: 'heroicons:truck-20-solid',
    link: '/transportation'
  },
]

</script>

<template>
    <section class="flex flex-col" aria-label="Секция услуг">
        <BaseSectionHeader 
            image="images/services.jpg"
            imageAlt="services-image"
            title="Наши услуги"
            description="Профессиональные услуги для стабильной и безопасной работы вашего транспорта"
        />
        <div class="flex flex-col md:flex-row flex-wrap">
            <BaseCard
                v-for="service in services"
                :key="service.title"
                orientation="vertical"
                :title="service.title"
                :description="service.description"
            >

            <template #icon>
                <BaseIconBlock>
                    <Icon
                        :name="service.icon"
                        class="text-[1.625rem] lg:text-[1.875rem] 2xl:text-[2.5rem]"
                    />
                </BaseIconBlock>
            </template>

            <template v-if="service.link" #button>
                <BaseButton
                    :to="service.link"
                    variant="secondary"
                    width="full"
                >
                    Подробнее
                </BaseButton>
            </template>
        </BaseCard>
        </div>
    </section>
</template>