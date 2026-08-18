<template>
  <section class="flex flex-col mx-4 lg:mx-0" aria-label="Форма расчёта грузоперевозки" id="form">
    <BaseFormHeader
      logo="/images/logo.png"
      title="Автоцентр на Лазурной"
      description="Рассчитаем ориентировочную стоимость грузоперевозки с учётом характеристик груза, маршрута, сроков доставки и дополнительных требований"
      class="px-4 lg:px-60 2xl:px-85 py-12.5 lg:py-25 2xl:py-30"
    />
    <div class="px-0 lg:px-55 2xl:px-67 border border-gray-150">
      <FormsTransportationForm />
    </div>
  </section>
</template>