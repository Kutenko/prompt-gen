import { useState, useCallback } from 'react';

// Типы данных
interface PromptData {
  photoType: string;
  photoStyle: string; // Стиль в рамках типа (журнал/художник/референс)
  artStyle: string;
  filter: string;
  angle: string;
  focus: string;
  position: string;
  object: string;
  objectAction: string;
  age: string;
  hair: string;
  hairColor: string;
  makeup: string;
  topClothing: string;
  topClothingColor: string;
  bottomClothing: string;
  bottomClothingColor: string;
  headwear: string;
  headwearColor: string;
  emotion: string;
  pose: string;
  background: string;
  environment: string;
  location: string;
  mood: string; // Настроение + освещение
  systemPrompt: string; // Системный промпт для качества
  negatives: string[];
  customNegative: string;
}

// Типы фотографии
const photoTypeOptions = [
  'Fashion-фотография',
  'Портрет',
  'Стрит-фото',
  'Свадебная фотография',
  'Предметная съёмка',
  'Пейзаж',
  'Архитектурная съёмка',
  'Натюрморт',
  'Спортивная съёмка',
  'Рекламная съёмка',
];

// Стили для каждого типа фотографии
const photoStyleOptions: Record<string, string[]> = {
  'Fashion-фотография': [
    'Vogue — высокая мода, глянцевая эстетика, драматичное освещение',
    'Harper\'s Bazaar — элегантность, утончённость, художественная фотография',
    'Elle — современная мода, яркие цвета, динамичные позы',
    'Cosmopolitan — яркая гламурная эстетика, смелые позы',
    'Marie Claire — естественная красота, мягкий свет',
    'L\'Officiel — французская элегантность, haute couture',
    'Numéro — минимализм, чёрно-белая эстетика, графичность',
    'Dazed — альтернативная мода, креативность',
    'i-D — британская уличная мода, документальный подход',
    'W Magazine — гламур, роскошь, драматичные портреты',
  ],
  'Портрет': [
    'Annie Leibovitz — театральность, драматичный свет, знаменитости',
    'Peter Lindbergh — чёрно-белая классика, естественность',
    'Richard Avedon — минимализм, выразительность, движение',
    'Irving Penn — студийная классика, элегантность',
    'Helmut Newton — провокация, сильная женственность',
    'Mario Testino — гламур, чувственность, цвет',
    'Steven Meisel — концептуальность, мода, драма',
    'Tim Walker — сказочность, сюрреализм, фантазия',
    'Dan Winters — кинематографичность, портреты знаменитостей',
    'Platon — крупные планы, политические портреты, характер',
  ],
  'Стрит-фото': [
    'Henri Cartier-Bresson — решающий момент, геометрия',
    'Vivian Maier — повседневность, наблюдение',
    'Garry Winogrand — энергия города, спонтанность',
    'Joel Meyerowitz — цветная уличная фотография',
    'Fan Ho — свет и тень, азиатская эстетика',
    'Saul Leiter — цвет, отражения, абстракция',
    'Daido Moriyama — зернистость, контраст, японский авангард',
    'Alex Webb — сложный цвет, многослойность',
  ],
  'Свадебная фотография': [
    'Классический стиль — традиционные позы, элегантность',
    'Репортажный стиль — естественные моменты, эмоции',
    'Fine Art — художественная эстетика, мягкий свет',
    'Dark and Moody — тёмные тона, драматичность',
    'Bright and Airy — светлые тона, воздушность',
    'Vintage — винтажная эстетика, плёночные цвета',
    'Cinematic — кинематографичность, широкие планы',
    'Editorial — журнальный стиль, постановочные кадры',
  ],
  'Предметная съёмка': [
    'Минимализм — чистый фон, акцент на объекте',
    'Lifestyle — объект в контексте использования',
    'Flat lay — вид сверху, композиция на плоскости',
    'Драматичный свет — контраст, тени, объём',
    'Bright & Clean — яркий свет, чистота, свежесть',
    'Dark & Moody — тёмный фон, драматичность',
    'Vintage — винтажная эстетика, тёплые тона',
    'Luxury — роскошь, блеск, премиальность',
  ],
  'Пейзаж': [
    'Ansel Adams — чёрно-белая классика, контраст, детализация',
    'Galen Rowell — цветная природа, драматичный свет',
    'Marc Adamus — современная пейзажная фотография, цвет',
    'Max Rive — эпические пейзажи, горы, звёзды',
    'Peter Lik — яркие цвета, культовые места',
    'Sebastião Salgado — документальный подход, ч/б',
  ],
  'Архитектурная съёмка': [
    'Минимализм — чистые линии, геометрия',
    'Драматичный — контраст, тени, объём',
    'HDR — расширенный динамический диапазон',
    'Чёрно-белый — графика, структура',
    'Золотой час — тёплый свет, длинные тени',
    'Синий час — холодные тона, городские огни',
    'Абстракция — детали, паттерны, формы',
  ],
  'Натюрморт': [
    'Классический — тёмный фон, драматичный свет',
    'Голландский — фламандская эстетика, символизм',
    'Современный — яркий свет, чистый фон',
    'Минималистичный — минимум деталей, акцент на форме',
    'Романтический — мягкий свет, цветы, нежность',
    'Драматичный — контраст, тени, объём',
  ],
  'Спортивная съёмка': [
    'Action — замороженное движение, резкость',
    'Эмоциональный — выражения лиц, страсть',
    'Кинематографичный — широкие планы, драма',
    'Чёрно-белый — графика, контраст',
    'Документальный — репортаж, естественность',
    'Художественный — постановка, свет, композиция',
  ],
  'Рекламная съёмка': [
    'Lifestyle — продукт в жизни, естественность',
    'Студийный — чистый фон, акцент на продукте',
    'Эмоциональный — чувства, ассоциации',
    'Минималистичный — простота, акцент',
    'Премиальный — роскошь, качество, детали',
    'Динамичный — движение, энергия',
  ],
};

// Художественные стили
const artStyleOptions = [
  'Русские сказки',
  'Барокко',
  'Минимализм',
  'Аниме',
  'Реализм',
  'Импрессионизм',
  'Сюрреализм',
  'Поп-арт',
  'Ар-нуво',
  'Готика',
  'Ренессанс',
  'Модерн',
  'Кубизм',
  'Экспрессионизм',
  'Фовизм',
  'Романтизм',
  'Классицизм',
  'Викторианский стиль',
  'Византийский стиль',
  'Японская гравюра',
];

const artStyleDescriptions: Record<string, string> = {
  'Русские сказки': 'стиль русских народных сказок с узорами и традиционными мотивами',
  'Барокко': 'барокко с пышными деталями и золотыми акцентами',
  'Минимализм': 'минимализм с лаконичными формами и пустым пространством',
  'Аниме': 'стиль аниме с выразительными глазами и яркими цветами',
  'Реализм': 'фотореализм с детализацией и естественными цветами',
  'Импрессионизм': 'импрессионизм с мягкими мазками и игрой света',
  'Сюрреализм': 'сюрреализм с ирреальными образами и сновидческой атмосферой',
  'Поп-арт': 'поп-арт с контрастными цветами и графичностью',
  'Ар-нуво': 'ар-нуво с плавными линиями и природными мотивами',
  'Готика': 'готика с тёмной палитрой и драматичным освещением',
  'Ренессанс': 'ренессанс с гармоничными пропорциями и мягким светом',
  'Модерн': 'модерн с чистыми линиями и геометрическими формами',
  'Кубизм': 'кубизм с геометрическими формами и множественными перспективами',
  'Экспрессионизм': 'экспрессионизм с искажёнными формами и интенсивными цветами',
  'Фовизм': 'фовизм с яркими цветами и упрощёнными формами',
  'Романтизм': 'романтизм с драматичными пейзажами и эмоциональной глубиной',
  'Классицизм': 'классицизм с идеальными пропорциями и симметрией',
  'Викторианский стиль': 'викторианский стиль с пышными деталями и орнаментами',
  'Византийский стиль': 'византийский стиль с золотыми фонами',
  'Японская гравюра': 'стиль японской гравюры укиё-э с плоскостностью и выразительными линиями',
};

// Фильтры
const filterOptions = [
  'Чёрно-белый',
  'Сепия',
  'Тёплые тона',
  'Холодные тона',
  'Высокий контраст',
  'Низкий контраст',
  'Матовый',
  'Глянцевый',
  'Винтаж',
  'Кросс-процесс',
  'HDR',
  'Мягкий фокус',
  'Зернистость',
  'Без фильтра',
];

const filterDescriptions: Record<string, string> = {
  'Чёрно-белый': 'чёрно-белое изображение',
  'Сепия': 'сепия с коричнево-золотистыми тонами',
  'Тёплые тона': 'тёплые тона',
  'Холодные тона': 'холодные тона',
  'Высокий контраст': 'высокий контраст',
  'Низкий контраст': 'низкий контраст',
  'Матовый': 'матовая обработка',
  'Глянцевый': 'глянцевая обработка',
  'Винтаж': 'винтажный фильтр',
  'Кросс-процесс': 'кросс-процесс',
  'HDR': 'HDR-обработка',
  'Мягкий фокус': 'мягкий фокус',
  'Зернистость': 'плёночная зернистость',
  'Без фильтра': 'без фильтра',
};

// Ракурсы
const angleOptions = [
  'Фронтальный',
  'Сверху (bird eye)',
  'Снизу (worm eye)',
  '3/4 спереди',
  '3/4 сзади',
  'Профиль',
  'Сзади',
  'Голландский угол',
  'По диагонали сверху',
  'На уровне глаз',
  'Сверхвысокий',
  'Сверхнизкий',
];

// Фокус (акцент на части)
const focusOptions = [
  'Лицо в фокусе, фон размыт',
  'Глаза в фокусе, остальное размыто',
  'Руки в фокусе, остальное размыто',
  'Деталь объекта в фокусе',
  'Передний план резкий, фон размыт',
  'Средний план резкий, передний и задний размыты',
  'Всё в кадре равномерно резко',
  'Силуэт на ярком фоне',
  'Отражение в воде или зеркале',
  'Контур и форма объекта',
];

// Позиции
const positionOptions = [
  'По центру',
  'Слева',
  'Справа',
  'Вверху',
  'Внизу',
  'В левом верхнем углу',
  'В правом верхнем углу',
  'В левом нижнем углу',
  'В правом нижнем углу',
  'Слегка слева от центра',
  'Слегка справа от центра',
];

// Объекты
const peopleObjects = ['Женщина', 'Мужчина', 'Ребёнок', 'Пара', 'Семья'];
const animalObjects = ['Собака', 'Кошка', 'Лошадь', 'Птица', 'Рыба', 'Лев', 'Тигр'];
const transportObjects = ['Автомобиль', 'Мотоцикл', 'Велосипед', 'Лодка', 'Самолёт'];
const plantObjects = ['Цветы', 'Дерево', 'Растение', 'Роза', 'Орхидея', 'Кактус'];
const foodObjects = ['Фрукты', 'Овощи', 'Ягоды', 'Еда', 'Напиток', 'Десерт', 'Торт', 'Пицца', 'Кофе', 'Чай', 'Вино'];
const itemObjects = ['Книга', 'Часы', 'Украшения', 'Сумка', 'Обувь', 'Очки', 'Камера', 'Ноутбук', 'Телефон'];
const architectureObjects = ['Здание', 'Мост', 'Замок', 'Башня', 'Фонтан', 'Памятник'];

const allObjects = [
  ...peopleObjects,
  ...animalObjects,
  ...transportObjects,
  ...plantObjects,
  ...foodObjects,
  ...itemObjects,
  ...architectureObjects,
];

const getAvailableObjects = (photoType: string): string[] => {
  switch (photoType) {
    case 'Предметная съёмка':
    case 'Натюрморт':
      return [...plantObjects, ...foodObjects, ...itemObjects, ...architectureObjects];
    case 'Пейзаж':
    case 'Архитектурная съёмка':
      return [...plantObjects, ...architectureObjects, ...transportObjects];
    case 'Спортивная съёмка':
      return [...peopleObjects, ...transportObjects];
    default:
      return allObjects;
  }
};

// Действия
const peopleActions = ['держит цветок', 'держит книгу', 'держит чашку', 'смотрит в окно', 'идёт по улице', 'сидит на стуле', 'стоит у стены', 'читает книгу', 'пьёт кофе', 'танцует', 'смеётся', 'мечтательно смотрит вдаль', 'смотрит в камеру'];
const animalActions = ['бежит', 'сидит', 'стоит', 'лежит', 'играет', 'смотрит в камеру', 'ест', 'спит', 'плывёт', 'летит'];
const transportActions = ['едет по дороге', 'стоит на парковке', 'мчится на скорости', 'припаркован', 'плывёт по воде', 'летит в небе'];
const plantActions = ['цветёт', 'шелестит на ветру', 'растёт', 'покрыт росой', 'клонится под ветром'];
const foodActions = ['парит', 'тает', 'украшено фруктами', 'подаётся на тарелке', 'наливается в бокал', 'дымится'];
const itemActions = ['лежит на поверхности', 'отражает свет', 'открыта', 'закрыта', 'светится', 'блестит'];
const architectureActions = ['возвышается', 'освещён закатным солнцем', 'отражается в воде', 'покрыт снегом', 'стоит в тумане'];

const getAvailableActions = (object: string): string[] => {
  if (peopleObjects.includes(object)) return peopleActions;
  if (animalObjects.includes(object)) return animalActions;
  if (transportObjects.includes(object)) return transportActions;
  if (plantObjects.includes(object)) return plantActions;
  if (foodObjects.includes(object)) return foodActions;
  if (itemObjects.includes(object)) return itemActions;
  if (architectureObjects.includes(object)) return architectureActions;
  return [];
};

// Возраст
const ageOptions = ['Малыш (0-3 года)', 'Ребёнок (4-12 лет)', 'Подросток (13-17 лет)', 'Молодого возраста (18-30 лет)', 'Взрослого возраста (31-50 лет)', 'Пожилого возраста (51-70 лет)', 'Старческого возраста (70+ лет)'];

const ageDescriptions: Record<string, string> = {
  'Малыш (0-3 года)': 'малыш с пухлыми щёчками',
  'Ребёнок (4-12 лет)': 'ребёнок с открытым, непосредственным выражением лица',
  'Подросток (13-17 лет)': 'подросток с юношеской энергией',
  'Молодого возраста (18-30 лет)': 'человек молодого возраста с упругой кожей и свежим видом',
  'Взрослого возраста (31-50 лет)': 'человек взрослого возраста со зрелыми чертами лица',
  'Пожилого возраста (51-70 лет)': 'человек пожилого возраста с морщинами на лице',
  'Старческого возраста (70+ лет)': 'человек старческого возраста с глубокими морщинами на лице',
};

// Причёски
const hairOptions = ['Длинные прямые', 'Длинные волнистые', 'Длинные кудрявые', 'Средние прямые', 'Средние волнистые', 'Короткая стрижка', 'Пикси', 'Каре', 'Боб', 'Пучок', 'Хвост', 'Коса', 'Распущенные с объёмом', 'Гладко зачёсанные назад', 'Пышные локоны'];

const hairDescriptions: Record<string, string> = {
  'Длинные прямые': 'длинные прямые волосы',
  'Длинные волнистые': 'длинные волнистые волосы',
  'Длинные кудрявые': 'длинные кудрявые волосы с локонами',
  'Средние прямые': 'прямые волосы до плеч',
  'Средние волнистые': 'волнистые волосы средней длины',
  'Короткая стрижка': 'короткая стрижка',
  'Пикси': 'стрижка пикси',
  'Каре': 'каре',
  'Боб': 'стрижка боб',
  'Пучок': 'волосы собраны в пучок',
  'Хвост': 'волосы собраны в хвост',
  'Коса': 'волосы заплетены в косу',
  'Распущенные с объёмом': 'объёмные распущенные волосы',
  'Гладко зачёсанные назад': 'гладко зачёсанные назад волосы',
  'Пышные локоны': 'пышные локоны',
};

// Цвета волос
const hairColorOptions = ['Чёрный', 'Тёмно-каштановый', 'Каштановый', 'Русый', 'Светло-русый', 'Блонд', 'Платиновый блонд', 'Красный', 'Медный', 'Рыжий', 'Седой', 'Белый'];

const hairColorDescriptions: Record<string, string> = {
  'Чёрный': 'чёрного цвета',
  'Тёмно-каштановый': 'тёмно-каштанового цвета',
  'Каштановый': 'каштанового цвета',
  'Русый': 'русого цвета',
  'Светло-русый': 'светло-русого цвета',
  'Блонд': 'светло-золотистого цвета',
  'Платиновый блонд': 'платинового цвета',
  'Красный': 'красного цвета',
  'Медный': 'медного цвета',
  'Рыжий': 'рыжего цвета',
  'Седой': 'седого цвета',
  'Белый': 'белого цвета',
};

// Макияж
const makeupOptions = ['Без макияжа', 'Естественный', 'Смоки айс', 'Красная помада', 'Nude', 'Яркие тени', 'Стрелки', 'Блестящий', 'Матовый', 'Готический', 'Авангардный'];

const makeupDescriptions: Record<string, string> = {
  'Без макияжа': 'без макияжа',
  'Естественный': 'лёгкий естественный макияж',
  'Смоки айс': 'макияж смоки айс с тёмными тенями',
  'Красная помада': 'красная помада',
  'Nude': 'макияж в nude-тонах',
  'Яркие тени': 'яркие цветные тени',
  'Стрелки': 'стрелки на глазах',
  'Блестящий': 'макияж с блёстками',
  'Матовый': 'матовый макияж',
  'Готический': 'тёмный готический макияж',
  'Авангардный': 'авангардный креативный макияж',
};

// Одежда
const topClothingOptions = ['Кожаная куртка', 'Джинсовая куртка', 'Блейзер', 'Пиджак', 'Свитер', 'Худи', 'Футболка', 'Рубашка', 'Блузка', 'Топ', 'Корсет', 'Платье', 'Пальто', 'Тренч', 'Шуба', 'Бомбер', 'Косуха', 'Жилет', 'Кроп-топ'];

const topClothingDescriptions: Record<string, string> = {
  'Кожаная куртка': 'кожаная куртка',
  'Джинсовая куртка': 'джинсовая куртка',
  'Блейзер': 'блейзер',
  'Пиджак': 'пиджак',
  'Свитер': 'свитер',
  'Худи': 'худи с капюшоном',
  'Футболка': 'футболка',
  'Рубашка': 'рубашка',
  'Блузка': 'блузка',
  'Топ': 'топ',
  'Корсет': 'корсет',
  'Платье': 'платье',
  'Пальто': 'пальто',
  'Тренч': 'тренч',
  'Шуба': 'шуба',
  'Бомбер': 'бомбер',
  'Косуха': 'косуха',
  'Жилет': 'жилет',
  'Кроп-топ': 'кроп-топ',
};

const bottomClothingOptions = ['Джинсы', 'Кожаные штаны', 'Брюки', 'Юбка', 'Шорты', 'Леггинсы', 'Спортивные штаны', 'Карго', 'Плиссированная юбка', 'Мини-юбка', 'Макси-юбка', 'Классические брюки', 'Зауженные брюки', 'Широкие брюки'];

const bottomClothingDescriptions: Record<string, string> = {
  'Джинсы': 'джинсы',
  'Кожаные штаны': 'кожаные штаны',
  'Брюки': 'брюки',
  'Юбка': 'юбка',
  'Шорты': 'шорты',
  'Леггинсы': 'леггинсы',
  'Спортивные штаны': 'спортивные штаны',
  'Карго': 'брюки карго',
  'Плиссированная юбка': 'плиссированная юбка',
  'Мини-юбка': 'мини-юбка',
  'Макси-юбка': 'макси-юбка',
  'Классические брюки': 'классические брюки',
  'Зауженные брюки': 'зауженные брюки',
  'Широкие брюки': 'широкие брюки',
};

const clothingColorOptions = ['Чёрный', 'Белый', 'Серый', 'Красный', 'Синий', 'Зелёный', 'Жёлтый', 'Оранжевый', 'Розовый', 'Фиолетовый', 'Коричневый', 'Бежевый', 'Голубой', 'Бордовый', 'Тёмно-синий', 'Оливковый'];

const clothingColorDescriptions: Record<string, string> = {
  'Чёрный': 'чёрный',
  'Белый': 'белый',
  'Серый': 'серый',
  'Красный': 'красный',
  'Синий': 'синий',
  'Зелёный': 'зелёный',
  'Жёлтый': 'жёлтый',
  'Оранжевый': 'оранжевый',
  'Розовый': 'розовый',
  'Фиолетовый': 'фиолетовый',
  'Коричневый': 'коричневый',
  'Бежевый': 'бежевый',
  'Голубой': 'голубой',
  'Бордовый': 'бордовый',
  'Тёмно-синий': 'тёмно-синий',
  'Оливковый': 'оливковый',
};

// Головные уборы
const headwearOptions = ['Шляпа', 'Бейсболка', 'Берет', 'Панама', 'Шапка', 'Повязка на голову', 'Ободок', 'Платок', 'Тюрбан', 'Кепка', 'Капюшон'];

const headwearDescriptions: Record<string, string> = {
  'Шляпа': 'шляпа с полями',
  'Бейсболка': 'бейсболка',
  'Берет': 'берет',
  'Панама': 'панама',
  'Шапка': 'шапка',
  'Повязка на голову': 'повязка на голову',
  'Ободок': 'ободок',
  'Платок': 'платок',
  'Тюрбан': 'тюрбан',
  'Кепка': 'кепка',
  'Капюшон': 'капюшон',
};

const headwearColorOptions = ['Чёрный', 'Белый', 'Серый', 'Красный', 'Синий', 'Зелёный', 'Жёлтый', 'Оранжевый', 'Розовый', 'Фиолетовый', 'Коричневый', 'Бежевый'];

const headwearColorDescriptions: Record<string, string> = {
  'Чёрный': 'чёрного цвета',
  'Белый': 'белого цвета',
  'Серый': 'серого цвета',
  'Красный': 'красного цвета',
  'Синий': 'синего цвета',
  'Зелёный': 'зелёного цвета',
  'Жёлтый': 'жёлтого цвета',
  'Оранжевый': 'оранжевого цвета',
  'Розовый': 'розового цвета',
  'Фиолетовый': 'фиолетового цвета',
  'Коричневый': 'коричневого цвета',
  'Бежевый': 'бежевого цвета',
};

// Эмоции
const emotionOptions = ['Спокойствие', 'Радость', 'Грусть', 'Задумчивость', 'Страсть', 'Загадочность', 'Уверенность', 'Уязвимость', 'Сила', 'Нежность', 'Дерзость', 'Меланхолия', 'Восторг', 'Сосредоточенность', 'Отстранённость', 'Игривость', 'Серьёзность', 'Мечтательность'];

const emotionDescriptions: Record<string, string> = {
  'Спокойствие': 'расслабленные черты лица, умиротворённое выражение',
  'Радость': 'широкая улыбка, приподнятые уголки губ, расслабленное выражение лица',
  'Грусть': 'опущенные уголки губ, задумчивое выражение',
  'Задумчивость': 'сосредоточенное выражение, лёгкая задумчивость',
  'Страсть': 'напряжённые черты, интенсивное выражение',
  'Загадочность': 'нейтральное выражение, лёгкая недосказанность',
  'Уверенность': 'поднятый подбородок, твёрдое выражение',
  'Уязвимость': 'открытое выражение, мягкие черты',
  'Сила': 'напряжённые мышцы, решительное выражение',
  'Нежность': 'мягкие черты, тёплое выражение',
  'Дерзость': 'вызывающее выражение, лёгкая усмешка',
  'Меланхолия': 'грустное выражение, опущенные уголки губ, задумчивое выражение',
  'Восторг': 'широкая улыбка, открытое выражение',
  'Сосредоточенность': 'концентрированное выражение, напряжённое внимание',
  'Отстранённость': 'нейтральное выражение, эмоциональная дистанция',
  'Игривость': 'лёгкая улыбка, озорное выражение',
  'Серьёзность': 'строгое выражение, сжатые губы',
  'Мечтательность': 'расслабленное выражение, лёгкая задумчивость',
};

// Позы
const poseOptions = ['Классический портрет', 'Три четверти', 'Профиль', 'Анфас', 'С лёгким поворотом', 'Динамичная поза', 'Сидя', 'Стоя с опорой', 'В движении', 'Крупный план лица', 'Поясной портрет', 'Ростовой портрет', 'С руками у лица', 'Со скрещенными руками', 'С опорой на стену', 'В прыжке', 'На коленях', 'Лёжа'];

const poseDescriptions: Record<string, string> = {
  'Классический портрет': 'классическая портретная поза',
  'Три четверти': 'поворот тела в три четверти',
  'Профиль': 'профиль',
  'Анфас': 'анфас',
  'С лёгким поворотом': 'лёгкий поворот тела',
  'Динамичная поза': 'динамичная поза с движением',
  'Сидя': 'сидячая поза',
  'Стоя с опорой': 'стоя с опорой',
  'В движении': 'поза в движении',
  'Крупный план лица': 'крупный план лица',
  'Поясной портрет': 'поясной портрет',
  'Ростовой портрет': 'ростовой портрет',
  'С руками у лица': 'руки у лица',
  'Со скрещенными руками': 'скрещенные руки',
  'С опорой на стену': 'с опорой на стену',
  'В прыжке': 'в прыжке',
  'На коленях': 'на коленях',
  'Лёжа': 'лёжа',
};

// Фоны
const backgroundOptions = ['Закатное солнце', 'Рассвет', 'Ночное небо', 'Облачное небо', 'Чистое голубое небо', 'Городские огни', 'Неоновые вывески', 'Лесная чаща', 'Горные вершины', 'Морской горизонт', 'Туманная дымка', 'Абстрактный градиент', 'Однотонный фон', 'Размытый интерьер', 'Боке огней'];

const backgroundDescriptions: Record<string, string> = {
  'Закатное солнце': 'закатное солнце с золотисто-оранжевой палитрой',
  'Рассвет': 'рассвет с пастельными тонами',
  'Ночное небо': 'ночное небо со звёздами',
  'Облачное небо': 'облачное небо',
  'Чистое голубое небо': 'голубое небо без облаков',
  'Городские огни': 'городские огни ночью',
  'Неоновые вывески': 'неоновые вывески',
  'Лесная чаща': 'густой лес',
  'Горные вершины': 'горные вершины',
  'Морской горизонт': 'морской горизонт',
  'Туманная дымка': 'туман',
  'Абстрактный градиент': 'абстрактный градиент',
  'Однотонный фон': 'однотонный фон',
  'Размытый интерьер': 'размытый интерьер',
  'Боке огней': 'боке огней',
};

// Окружения
const environmentOptions = ['Городская улица', 'Парк', 'Пляж', 'Горы', 'Лес', 'Пустыня', 'Промышленная зона', 'Студия', 'Квартира', 'Офис', 'Кафе', 'Ресторан', 'Галерея', 'Музей', 'Театр'];

const environmentDescriptions: Record<string, string> = {
  'Городская улица': 'городская улица с архитектурой',
  'Парк': 'парк с зелёными аллеями',
  'Пляж': 'песчаный пляж с морем',
  'Горы': 'горный пейзаж',
  'Лес': 'лес с деревьями',
  'Пустыня': 'пустынный ландшафт',
  'Промышленная зона': 'индустриальная зона с металлическими конструкциями',
  'Студия': 'фотостудия с контролируемым освещением',
  'Квартира': 'жилая квартира',
  'Офис': 'офисное помещение',
  'Кафе': 'кафе с тёплым освещением',
  'Ресторан': 'ресторан с приглушённым светом',
  'Галерея': 'художественная галерея с белыми стенами',
  'Музей': 'музейный зал',
  'Театр': 'театральный зал',
};

// Локации
const locationOptions = ['Асфальт', 'Мраморный пол', 'Деревянный настил', 'Бетонная стена', 'Песок', 'Трава', 'Вода', 'Зеркальная поверхность', 'Тёмный бархат', 'Белый холст'];

const locationDescriptions: Record<string, string> = {
  'Асфальт': 'текстурированный асфальт с трещинами',
  'Мраморный пол': 'мраморный пол с прожилками',
  'Деревянный настил': 'деревянный настил с текстурой волокон',
  'Бетонная стена': 'бетонная стена с индустриальной фактурой',
  'Песок': 'золотистый песок',
  'Трава': 'зелёная трава',
  'Вода': 'водная гладь с рябью',
  'Зеркальная поверхность': 'зеркальная поверхность с отражениями',
  'Тёмный бархат': 'тёмный бархат',
  'Белый холст': 'белый холст',
};

// Настроение (объединяет настроение и освещение)
const moodOptions = [
  'Элегантное, мягкое студийное освещение',
  'Драматичное, контрастный свет с глубокими тенями',
  'Романтичное, тёплый золотистый свет',
  'Мистическое, приглушённый свет с туманом',
  'Энергичное, яркий динамичный свет',
  'Спокойное, мягкий рассеянный свет',
  'Ностальгическое, тёплый винтажный свет',
  'Загадочное, низкий ключ с тенями',
  'Сенсуальное, мягкий контровой свет',
  'Триумфальное, яркий торжественный свет',
  'Меланхоличное, приглушённый холодный свет',
  'Весёлое, яркий солнечный свет',
];

// Системные промпты для качества
const systemPromptPresets = [
  {
    name: 'Фотореализм (высокое качество)',
    prompt: 'Фотореалистичное изображение, 8K, профессиональная студийная фотография, высокая детализация, естественные цвета, мягкое студийное освещение с естественными тенями, глубина резкости, высокая детализация кожи, никакого чрезмерного ретуширования',
  },
  {
    name: 'Beauty (косметика/уход)',
    prompt: 'Фотореалистичное изображение, 8K, editorial beauty photography, эффект glass skin, сияющая увлажнённая кожа, лёгкий dewy-финиш, натуральный макияж no makeup makeup, тёплые естественные тона кожи, мягкое студийное освещение, белый фон',
  },
  {
    name: 'Fashion editorial',
    prompt: 'Фотореалистичное изображение, 8K, профессиональная fashion съёмка, высокая детализация тканей и текстур, драматичное освещение, глубокие тени, кинематографичность, журнальная эстетика',
  },
  {
    name: 'Портрет (характер)',
    prompt: 'Фотореалистичное изображение, 8K, профессиональный портрет, высокая детализация кожи с порами и естественной текстурой, выразительный взгляд, мягкое освещение Rembrandt, глубокие тени, кинематографичность',
  },
  {
    name: 'Пейзаж (эпический)',
    prompt: 'Фотореалистичное изображение, 8K, профессиональная пейзажная фотография, высокая детализация, широкий динамический диапазон, насыщенные цвета, атмосферные эффекты, эпический масштаб',
  },
  {
    name: 'Предметная съёмка (продукт)',
    prompt: 'Фотореалистичное изображение, 8K, профессиональная предметная съёмка, высокая детализация текстур и материалов, чистый фон, мягкое студийное освещение, акцент на продукте, коммерческая эстетика',
  },
];

// Negative prompt
const negativeItems = [
  'перегруженный кадр',
  'лишние предметы рядом с объектом',
  'хаос',
  'резкие тени',
  'низкая резкость',
  'зернистость',
  'текст',
  'логотипы',
  'блики',
  'неестественная кожа',
  'мусор / грязь',
  'водяные знаки',
  'случайные люди в кадре',
];

export default function App() {
  const [data, setData] = useState<PromptData>({
    photoType: 'Fashion-фотография',
    photoStyle: '',
    artStyle: '',
    filter: '',
    angle: 'Фронтальный',
    focus: '',
    position: '',
    object: '',
    objectAction: '',
    age: '',
    hair: '',
    hairColor: '',
    makeup: '',
    topClothing: '',
    topClothingColor: '',
    bottomClothing: '',
    bottomClothingColor: '',
    headwear: '',
    headwearColor: '',
    emotion: '',
    pose: '',
    background: '',
    environment: '',
    location: '',
    mood: '',
    systemPrompt: '',
    negatives: [...negativeItems],
    customNegative: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof PromptData, value: string) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'photoType') {
        newData.photoStyle = '';
        const availableObjects = getAvailableObjects(value);
        if (prev.object && !availableObjects.includes(prev.object)) {
          newData.object = '';
          newData.objectAction = '';
        }
      }
      
      if (field === 'object') {
        const availableActions = getAvailableActions(value);
        if (prev.objectAction && !availableActions.includes(prev.objectAction)) {
          newData.objectAction = '';
        }
      }
      
      return newData;
    });
  };

  const toggleNegative = (item: string) => {
    setData(prev => ({
      ...prev,
      negatives: prev.negatives.includes(item)
        ? prev.negatives.filter(n => n !== item)
        : [...prev.negatives, item],
    }));
  };

  const generatePrompt = useCallback(() => {
    const paragraphs: string[] = [];
    const portraitTypes = ['Портрет', 'Fashion-фотография', 'Стрит-фото', 'Свадебная фотография'];
    const isPortrait = portraitTypes.includes(data.photoType);

    // Системный промпт (если есть)
    if (data.systemPrompt) {
      paragraphs.push(data.systemPrompt);
    }

    // Абзац 1: Стиль и тип
    const styleParts: string[] = [];
    if (data.photoType) {
      styleParts.push(data.photoType);
    }
    if (data.photoStyle) {
      styleParts.push(`стиль ${data.photoStyle}`);
    }
    if (data.artStyle) {
      styleParts.push(artStyleDescriptions[data.artStyle] || data.artStyle);
    }
    if (data.filter && data.filter !== 'Без фильтра') {
      styleParts.push(filterDescriptions[data.filter] || data.filter);
    }
    if (styleParts.length) {
      paragraphs.push(styleParts.join(', ') + '.');
    }

    // Абзац 2: Композиция
    if (data.angle || data.focus || data.position) {
      const compParts: string[] = [];
      
      if (data.angle) {
        compParts.push(`съёмка ведётся ${data.angle.toLowerCase()} ракурс`);
      }
      
      if (data.focus) {
        compParts.push(data.focus);
      }
      
      if (data.position) {
        compParts.push(`объект расположен ${data.position.toLowerCase()}`);
      }
      
      if (compParts.length) {
        paragraphs.push(compParts.join(', ') + '.');
      }
    }

    // Абзац 3: Объект
    if (data.object) {
      let intro = data.object;
      
      if (data.objectAction) {
        intro += ', ' + data.objectAction;
      }
      
      if (isPortrait) {
        const details: string[] = [];
        if (data.age) details.push(ageDescriptions[data.age] || data.age);
        if (data.hair) {
          let hairDesc = hairDescriptions[data.hair] || data.hair;
          if (data.hairColor) {
            hairDesc += ' ' + (hairColorDescriptions[data.hairColor] || data.hairColor);
          }
          details.push(hairDesc);
        }
        
        if (details.length) {
          intro += ', ' + details.join(', ');
        }
        
        const clothing: string[] = [];
        if (data.makeup) {
          clothing.push(makeupDescriptions[data.makeup] || data.makeup);
        }
        if (data.topClothing) {
          let top = topClothingDescriptions[data.topClothing] || data.topClothing;
          if (data.topClothingColor) top += ` ${clothingColorDescriptions[data.topClothingColor] || data.topClothingColor} цвета`;
          clothing.push(top);
        }
        if (data.bottomClothing) {
          let bottom = bottomClothingDescriptions[data.bottomClothing] || data.bottomClothing;
          if (data.bottomClothingColor) bottom += ` ${clothingColorDescriptions[data.bottomClothingColor] || data.bottomClothingColor} цвета`;
          clothing.push(bottom);
        }
        
        if (data.headwear) {
          let headwearDesc = headwearDescriptions[data.headwear] || data.headwear;
          if (data.headwearColor) {
            headwearDesc += ' ' + (headwearColorDescriptions[data.headwearColor] || data.headwearColor);
          }
          clothing.push(headwearDesc);
        }
        
        if (clothing.length) {
          intro += `, ${clothing.join(', ')}`;
        }
      }
      
      paragraphs.push('На фотографии — ' + intro + '.');
    }

    // Абзац 4: Эмоция и поза
    if (isPortrait && (data.emotion || data.pose)) {
      const emotionPoseParts: string[] = [];
      
      if (data.emotion) {
        emotionPoseParts.push(`Выражение лица передаёт ${emotionDescriptions[data.emotion] || data.emotion}`);
      }
      
      if (data.pose) {
        emotionPoseParts.push(`${data.object} находится в позе: ${poseDescriptions[data.pose] || data.pose}`);
      }
      
      if (emotionPoseParts.length) {
        paragraphs.push(emotionPoseParts.join('. ') + '.');
      }
    }

    // Абзац 5: Настроение
    if (data.mood) {
      paragraphs.push(`Настроение — ${data.mood}.`);
    }

    // Абзац 6: Окружение
    if (data.background) {
      const bgDesc = backgroundDescriptions[data.background] || data.background;
      paragraphs.push(`На заднем плане виднеется ${bgDesc}.`);
    } else if (data.environment || data.location) {
      const envParts: string[] = [];
      if (data.environment) envParts.push(environmentDescriptions[data.environment] || data.environment);
      if (data.location) envParts.push(locationDescriptions[data.location] || data.location);
      if (envParts.length) {
        paragraphs.push(`Окружение: ${envParts.join(', ')}.`);
      }
    }

    // Negative prompt
    const negativeList = [
      ...data.negatives,
      ...(data.customNegative.trim() ? data.customNegative.split(',').map(s => s.trim()).filter(Boolean) : []),
    ];
    if (negativeList.length) {
      paragraphs.push(`\nNegative prompt: ${negativeList.join(', ')}.`);
    }

    setGeneratedPrompt(paragraphs.join('\n\n'));
    setCopied(false);
  }, [data]);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = generatedPrompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback копирование не сработало:', err);
        }
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const resetForm = () => {
    setData({
      photoType: 'Fashion-фотография',
      photoStyle: '',
      artStyle: '',
      filter: '',
      angle: 'Фронтальный',
      focus: '',
      position: '',
      object: '',
      objectAction: '',
      age: '',
      hair: '',
      hairColor: '',
      makeup: '',
      topClothing: '',
      topClothingColor: '',
      bottomClothing: '',
      bottomClothingColor: '',
      headwear: '',
      headwearColor: '',
      emotion: '',
      pose: '',
      background: '',
      environment: '',
      location: '',
      mood: '',
      systemPrompt: '',
      negatives: [...negativeItems],
      customNegative: '',
    });
    setGeneratedPrompt('');
  };

  const generateRandomPrompt = () => {
    const randomChoice = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomChoiceWithEmpty = <T,>(arr: T[], emptyProbability: number = 0.3): T | '' => {
      return Math.random() < emptyProbability ? '' : randomChoice(arr);
    };

    const randomPhotoType = randomChoice(photoTypeOptions);
    const availableObjects = getAvailableObjects(randomPhotoType);
    const randomObject = randomChoice(availableObjects);
    const availableActions = getAvailableActions(randomObject);
    const randomAction = randomChoiceWithEmpty(availableActions, 0.4);
    
    const portraitTypes = ['Портрет', 'Fashion-фотография', 'Стрит-фото', 'Свадебная фотография'];
    const isPortrait = portraitTypes.includes(randomPhotoType);
    
    const availableStyles = photoStyleOptions[randomPhotoType] || [];
    
    const randomData: PromptData = {
      photoType: randomPhotoType,
      photoStyle: randomChoiceWithEmpty(availableStyles, 0.4),
      artStyle: randomChoiceWithEmpty(artStyleOptions, 0.7),
      filter: randomChoiceWithEmpty(filterOptions.filter(f => f !== 'Без фильтра'), 0.6),
      angle: randomChoice(angleOptions),
      focus: randomChoiceWithEmpty(focusOptions, 0.3),
      position: randomChoiceWithEmpty(positionOptions, 0.4),
      object: randomObject,
      objectAction: randomAction,
      age: isPortrait ? randomChoiceWithEmpty(ageOptions, 0.3) : '',
      hair: isPortrait ? randomChoiceWithEmpty(hairOptions, 0.3) : '',
      hairColor: isPortrait && Math.random() > 0.3 ? randomChoice(hairColorOptions) : '',
      makeup: isPortrait ? randomChoiceWithEmpty(makeupOptions, 0.4) : '',
      topClothing: isPortrait && peopleObjects.includes(randomObject) ? randomChoiceWithEmpty(topClothingOptions, 0.3) : '',
      topClothingColor: isPortrait && peopleObjects.includes(randomObject) && Math.random() > 0.3 ? randomChoice(clothingColorOptions) : '',
      bottomClothing: isPortrait && peopleObjects.includes(randomObject) ? randomChoiceWithEmpty(bottomClothingOptions, 0.3) : '',
      bottomClothingColor: isPortrait && peopleObjects.includes(randomObject) && Math.random() > 0.3 ? randomChoice(clothingColorOptions) : '',
      headwear: isPortrait && peopleObjects.includes(randomObject) ? randomChoiceWithEmpty(headwearOptions, 0.6) : '',
      headwearColor: isPortrait && peopleObjects.includes(randomObject) && Math.random() > 0.5 ? randomChoice(headwearColorOptions) : '',
      emotion: isPortrait ? randomChoiceWithEmpty(emotionOptions, 0.3) : '',
      pose: isPortrait ? randomChoiceWithEmpty(poseOptions, 0.3) : '',
      background: randomChoiceWithEmpty(backgroundOptions, 0.4),
      environment: randomChoiceWithEmpty(environmentOptions, 0.5),
      location: randomChoiceWithEmpty(locationOptions, 0.6),
      mood: randomChoiceWithEmpty(moodOptions, 0.3),
      systemPrompt: randomChoiceWithEmpty(systemPromptPresets.map(p => p.prompt), 0.5),
      negatives: [...negativeItems],
      customNegative: '',
    };
    
    setData(randomData);
  };

  const portraitTypes = ['Портрет', 'Fashion-фотография', 'Стрит-фото', 'Свадебная фотография'];
  const isPortraitType = portraitTypes.includes(data.photoType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          📸 Генератор промптов для AI-фотографии
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Стиль и тип */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-5">
              <h2 className="text-lg font-semibold text-purple-300 mb-4">🎨 Стиль и тип</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Тип фотографии</label>
                  <select
                    value={data.photoType}
                    onChange={(e) => handleChange('photoType', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white text-sm"
                  >
                    {photoTypeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Стиль в рамках типа</label>
                  <select
                    value={data.photoStyle}
                    onChange={(e) => handleChange('photoStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {(photoStyleOptions[data.photoType] || []).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Художественный стиль</label>
                  <select
                    value={data.artStyle}
                    onChange={(e) => handleChange('artStyle', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {artStyleOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Фильтр</label>
                  <select
                    value={data.filter}
                    onChange={(e) => handleChange('filter', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white text-sm"
                  >
                    {filterOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Композиция */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-5">
              <h2 className="text-lg font-semibold text-blue-300 mb-4">📐 Композиция</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ракурс</label>
                  <select
                    value={data.angle}
                    onChange={(e) => handleChange('angle', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {angleOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Фокус</label>
                  <select
                    value={data.focus}
                    onChange={(e) => handleChange('focus', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {focusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Позиция в кадре</label>
                  <select
                    value={data.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {positionOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Объект */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-pink-500/20 p-5">
              <h2 className="text-lg font-semibold text-pink-300 mb-4">🎯 Объект</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Объект</label>
                    <select
                      value={data.object}
                      onChange={(e) => handleChange('object', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                    >
                      <option value="">Не выбрано</option>
                      {getAvailableObjects(data.photoType).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Действие объекта</label>
                    <select
                      value={data.objectAction}
                      onChange={(e) => handleChange('objectAction', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                    >
                      <option value="">Не выбрано</option>
                      {getAvailableActions(data.object).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {isPortraitType && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Возраст</label>
                      <select
                        value={data.age}
                        onChange={(e) => handleChange('age', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {ageOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Причёска</label>
                        <select
                          value={data.hair}
                          onChange={(e) => handleChange('hair', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                        >
                          <option value="">Не выбрано</option>
                          {hairOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Цвет волос</label>
                        <select
                          value={data.hairColor}
                          onChange={(e) => handleChange('hairColor', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                        >
                          <option value="">Не выбрано</option>
                          {hairColorOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Эмоция</label>
                        <select
                          value={data.emotion}
                          onChange={(e) => handleChange('emotion', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                        >
                          <option value="">Не выбрано</option>
                          {emotionOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Поза</label>
                        <select
                          value={data.pose}
                          onChange={(e) => handleChange('pose', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-pink-500/30 rounded-lg text-white text-sm"
                        >
                          <option value="">Не выбрано</option>
                          {poseOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Одежда - только для людей */}
            {peopleObjects.includes(data.object) && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 p-5">
                <h2 className="text-lg font-semibold text-indigo-300 mb-4">👗 Одежда</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Одежда (верх)</label>
                      <select
                        value={data.topClothing}
                        onChange={(e) => handleChange('topClothing', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {topClothingOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Цвет верха</label>
                      <select
                        value={data.topClothingColor}
                        onChange={(e) => handleChange('topClothingColor', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {clothingColorOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Одежда (низ)</label>
                      <select
                        value={data.bottomClothing}
                        onChange={(e) => handleChange('bottomClothing', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {bottomClothingOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Цвет низа</label>
                      <select
                        value={data.bottomClothingColor}
                        onChange={(e) => handleChange('bottomClothingColor', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {clothingColorOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Макияж</label>
                      <select
                        value={data.makeup}
                        onChange={(e) => handleChange('makeup', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {makeupOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Головной убор</label>
                      <select
                        value={data.headwear}
                        onChange={(e) => handleChange('headwear', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                      >
                        <option value="">Не выбрано</option>
                        {headwearOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Цвет головного убора</label>
                    <select
                      value={data.headwearColor}
                      onChange={(e) => handleChange('headwearColor', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-white text-sm"
                    >
                      <option value="">Не выбрано</option>
                      {headwearColorOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Настроение */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-5">
              <h2 className="text-lg font-semibold text-yellow-300 mb-4">💡 Настроение</h2>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Настроение и освещение</label>
                <select
                  value={data.mood}
                  onChange={(e) => handleChange('mood', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white text-sm"
                >
                  <option value="">Не выбрано</option>
                  {moodOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Окружение */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/20 p-5">
              <h2 className="text-lg font-semibold text-green-300 mb-4">🌍 Окружение</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Фон</label>
                  <select
                    value={data.background}
                    onChange={(e) => handleChange('background', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-green-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {backgroundOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Окружение</label>
                    <select
                      value={data.environment}
                      onChange={(e) => handleChange('environment', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-green-500/30 rounded-lg text-white text-sm"
                    >
                      <option value="">Не выбрано</option>
                      {environmentOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Локация</label>
                    <select
                      value={data.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-green-500/30 rounded-lg text-white text-sm"
                    >
                      <option value="">Не выбрано</option>
                      {locationOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Системный промпт */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-5">
              <h2 className="text-lg font-semibold text-cyan-300 mb-4">⚙️ Системный промпт (качество)</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Пресет</label>
                  <select
                    value={data.systemPrompt}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="">Не выбрано</option>
                    {systemPromptPresets.map(preset => (
                      <option key={preset.name} value={preset.prompt}>{preset.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Свой системный промпт</label>
                  <textarea
                    value={data.systemPrompt}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    placeholder="Введите свои инструкции для качества..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white text-sm h-24 resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Negative prompt */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/20 p-5">
              <h2 className="text-lg font-semibold text-red-300 mb-4">🚫 Negative prompt</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {negativeItems.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleNegative(item)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      data.negatives.includes(item)
                        ? 'bg-red-600/30 border border-red-500/50 text-red-200'
                        : 'bg-gray-800/30 border border-gray-700/30 text-gray-500 hover:border-gray-500/50'
                    }`}
                  >
                    {data.negatives.includes(item) ? '✕' : '+'} {item}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={data.customNegative}
                onChange={(e) => handleChange('customNegative', e.target.value)}
                placeholder="Добавить свои ограничения через запятую..."
                className="w-full px-3 py-2 bg-gray-800/50 border border-red-500/30 rounded-lg text-white text-sm"
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                onClick={generatePrompt}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
              >
                ✨ Генерировать промпт
              </button>
              <button
                onClick={generateRandomPrompt}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                🎲 Случайный
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/30 text-gray-300 rounded-xl transition-all"
              >
                🔄 Сбросить
              </button>
            </div>
          </div>

          {/* Правая колонка - результат */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-300">📝 Готовый промпт</h2>
                {generatedPrompt && (
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {copied ? '✓ Скопировано!' : '📋 Копировать'}
                  </button>
                )}
              </div>

              {generatedPrompt ? (
                <pre className="whitespace-pre-wrap bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-200 font-mono leading-relaxed max-h-[70vh] overflow-y-auto">
                  {generatedPrompt}
                </pre>
              ) : (
                <div className="bg-gray-900/40 border border-dashed border-gray-700/50 rounded-xl p-10 text-center">
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-gray-500 text-sm">
                    Заполните параметры и нажмите<br />
                    <span className="text-purple-400 font-medium">«Генерировать промпт»</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
