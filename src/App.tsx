import { useState, useCallback } from 'react';

/* ───────────── types ───────────── */
interface PromptData {
  role: string;
  object: string;
  location: string;
  environment: string;
  environmentType: string;
  background: string;
  tone: string;
  lighting: string;
  composition: string;
  lineSource: string;
  angle: string;
  structure: string;
  center: string;
  centerSize: string;
  linearStructure: string;
  mainColor: string;
  accentColor: string;
  textureElement: string;
  style: string;
  format: string;
  negatives: string[];
  customNegative: string;
}

/* ───────────── options ───────────── */
const roleOptions = [
  'Профессиональный фотограф — студийная съёмка, идеальная техника, выверенная композиция',
  'Fashion-фотограф — глянцевый стиль, подиумная эстетика, акцент на одежде и позе',
  'Журнальный фотограф — editorial, обложки Vogue/Harper\'s Bazaar, нарратив и атмосфера',
  'Кинематографист — кинематографичный кадр, анаморфный стиль, глубокая история в кадре',
  'Арт-директор — концептуальный подход, визуальные метафоры, смелые решения',
  'Концептуальный художник — абстракция, символизм, выход за рамки коммерческой съёмки',
  'Документалист — реализм, естественность, без постановки, честный кадр',
  'Портретист — акцент на лице и эмоциях, работа с характером, психологизм',
  'Предметный фотограф — product shot, идеальная детализация, коммерческая подача',
  'Пейзажный фотограф — масштаб, природа, свет, глубина пространства',
  'Street-фотограф — городская энергия, спонтанность, социальный контекст',
  'Рекламный фотограф — продающий кадр, чистота, привлекательность, бренд-эстетика',
];

const toneOptions = [
  'Бунтарский', 'Романтичный', 'Драматичный', 'Меланхоличный',
  'Весёлый', 'Мистический', 'Элегантный', 'Агрессивный',
  'Нежный', 'Загадочный', 'Ностальгический', 'Энергичный',
  'Спокойный', 'Тревожный', 'Триумфальный', 'Сенсуальный',
];

const lightingOptions = [
  'High‑key — яркое, равномерное, без резких теней, чистое и воздушное',
  'Low‑key — глубокие тени, минимум света, драматичность и контраст',
  'Естественный свет — мягкий, рассеянный, живое ощущение',
  'Золотой час — тёплый, золотистый, магический свет заката/рассвета',
  'Синий час — холодный, сумеречный, мистическая атмосфера',
  'Контровой свет — силуэт, ореол, драматичный контур',
  'Боковой свет — объём, текстура, выразительные тени',
  'Мягкий рассеянный — деликатный, обволакивающий, без резких переходов',
  'Жёсткий направленный — графичный, контрастный, архитектурный',
  'Неоновый — цветной, футуристичный, городской ночной',
  'Свечи — тёплый, интимный, мерцающий, живописный',
  'Студийный — контролируемый, профессиональный, чистый',
  'Rembrandt — классический портретный, треугольник света на щеке',
  'Split lighting — половина лица в свете, половина в тени',
  'Butterfly lighting — гламурный, свет сверху, тень под носом бабочкой',
];

const compositionOptions = [
  'Крест — направляющие линии ведут к объекту крестообразно',
  'Правило третей — объект на пересечении линий сетки 3×3',
  'Диагональ — динамичная линия, энергия и движение',
  'Симметрия — зеркальность, порядок, монументальность',
  'Золотое сечение — спираль Фибоначчи, природная гармония',
  'Рамка в кадре — объект обрамлён элементами окружения',
  'Ведущие линии — взгляд следует по линиям к объекту',
  'Паттерн — повторяющиеся элементы, ритм, текстура',
  'Треугольник — устойчивая композиция, сила и стабильность',
  'Спираль — закрученное движение, вовлечение в кадр',
  'Центральная — объект строго в центре, власть и фокус',
  'Асимметрия — намеренный дисбаланс, напряжение, интерес',
  'Минимализм — минимум элементов, максимум смысла',
];

const angleOptions = [
  'Фронтальный — прямо, глаза в глаза, открытость',
  'Сверху (bird eye) — вид сверху, всеобъемлющий, уязвимость',
  'Снизу (worm eye) — вид снизу, монументальность, власть',
  '3/4 спереди — объёмный, портретный, естественный',
  '3/4 сзади — загадочность, недосказанность, глубина',
  'Профиль — силуэт, линия, грация',
  'Сзади — тайна, отстранённость, приглашение следовать',
  'Голландский угол — наклон, беспокойство, динамика',
  'По диагонали сверху — объёмный обзор, перспектива',
  'На уровне глаз — равенство, интимность, контакт',
  'Сверхвысокий — панорама, масштаб, отстранённость',
  'Сверхнизкий — героизация, доминирование, эпичность',
];

const structureOptions = [
  'Одна точка фокуса', 'Две точки фокуса', 'Три точки фокуса',
  'Множественные точки', 'Распределённый фокус', 'Без выраженного фокуса',
];

const centerOptions = ['Один', 'Два', 'Три', 'Группа', 'Рассеянный'];

const centerSizeOptions = ['Минимальный', 'Малый', 'Средний', 'Большой', 'Доминирующий'];

const linearStructureOptions = [
  'Вертикальная', 'Горизонтальная', 'Диагональная',
  'Криволинейная', 'Концентрическая', 'Хаотичная',
  'Лучевая', 'S-образная',
];

const styleOptions = [
  'Журнальный — editorial, обложка, нарратив',
  'Кинематографический — кинокадр, анаморфный, история',
  'Документальный — реализм, правда, без ретуши',
  'Портретный — лицо, эмоция, характер',
  'Fashion — мода, глянец, подиум',
  'Street — улица, энергия, спонтанность',
  'Fine Art — искусство, концепция, галерея',
  'Концептуальный — идея, метафора, символизм',
  'Ретро — винтаж, ностальгия, плёнка',
  'Футуристический — технологии, неон, будущее',
  'Минималистичный — чистота, простота, пустота',
  'Барокко — роскошь, детализация, театр',
  'Поп-арт — яркость, масс-культура, ирония',
  'Нуар — тень, тайна, контраст',
  'Этнографический — культура, традиции, аутентичность',
];

const formatOptions = ['4:3', '16:9', '1:1', '3:2', '2:3', '9:16', '21:9'];

const negativeItems = [
  'перегруженный кадр',
  'лишние предметы рядом с объектом',
  'хаос',
  'домашний уют',
  'резкие тени',
  'низкая резкость',
  'зернистость',
  'натурализм',
  'передний план',
  'крупный план',
  'отсутствие дистанции',
  'яркие цвета вне палитры',
  'текст',
  'логотипы',
  'блики',
  'визуальный шум',
  'плоское изображение',
  'пересвет',
  'недоэкспонирование',
  'размытый объект',
  'искажённые пропорции',
  'лишние руки/пальцы',
  'двойные контуры',
  'неестественная кожа',
  'стоковый вид',
  'банальная композиция',
  'случайные люди в кадре',
  'мусор / грязь',
  'водяные знаки',
];

/* ───────────── component ───────────── */
function App() {
  const [data, setData] = useState<PromptData>({
    role: roleOptions[0],
    object: '',
    location: '',
    environment: '',
    environmentType: '',
    background: '',
    tone: toneOptions[2],
    lighting: lightingOptions[0],
    composition: compositionOptions[0],
    lineSource: '',
    angle: angleOptions[0],
    structure: structureOptions[0],
    center: centerOptions[0],
    centerSize: centerSizeOptions[1],
    linearStructure: linearStructureOptions[0],
    mainColor: '',
    accentColor: '',
    textureElement: '',
    style: styleOptions[0],
    format: formatOptions[0],
    negatives: [
      'перегруженный кадр',
      'лишние предметы рядом с объектом',
      'хаос',
      'резкие тени',
      'низкая резкость',
      'зернистость',
      'текст',
      'логотипы',
      'блики',
    ],
    customNegative: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof PromptData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleNegative = (item: string) => {
    setData((prev) => ({
      ...prev,
      negatives: prev.negatives.includes(item)
        ? prev.negatives.filter((n) => n !== item)
        : [...prev.negatives, item],
    }));
  };

  const selectAllNegatives = () => setData((p) => ({ ...p, negatives: [...negativeItems] }));
  const clearAllNegatives = () => setData((p) => ({ ...p, negatives: [] }));

  /* ── helpers to extract short label from "label — description" ── */
  const short = (val: string) => {
    const idx = val.indexOf(' — ');
    return idx > -1 ? val.slice(0, idx) : val;
  };

  /* ── generate ── */
  const generatePrompt = useCallback(() => {
    const blocks: string[] = [];

    // Role
    if (data.role) blocks.push(`Ты — ${data.role}.`);

    // Object + location + environment + background
    const sceneParts: string[] = [];
    if (data.object) sceneParts.push(`«${data.object}»`);
    if (data.location) sceneParts.push(`на ${data.location}`);
    if (sceneParts.length) {
      let scene = sceneParts.join(' ');
      if (data.environment || data.environmentType) {
        const envParts = [data.environment, data.environmentType].filter(Boolean).join(', ');
        scene += `, в окружении ${envParts}`;
      }
      if (data.background) scene += `, на фоне «${data.background}»`;
      blocks.push(scene + '.');
    }

    // Tone + lighting
    const moodParts: string[] = [];
    if (data.tone) moodParts.push(`настроение — ${short(data.tone).toLowerCase()}`);
    if (data.lighting) moodParts.push(`освещение ${short(data.lighting).toLowerCase()}`);
    if (moodParts.length) blocks.push(moodParts.join(', ') + '.');

    // Composition + lines + angle
    const compParts: string[] = [];
    if (data.composition) compParts.push(`композиция «${short(data.composition)}»`);
    if (data.lineSource) compParts.push(`направляющие линии — ${data.lineSource}`);
    if (data.angle) compParts.push(`ракурс ${short(data.angle).toLowerCase()}`);
    if (compParts.length) blocks.push(compParts.join(', ') + '.');

    // Structure + focus
    const structParts: string[] = [];
    if (data.linearStructure) structParts.push(`структура ${data.linearStructure.toLowerCase()}`);
    const focusParts = [data.structure, data.center, data.centerSize].filter(Boolean).map((v) => v.toLowerCase());
    if (focusParts.length) structParts.push(`фокус — ${focusParts.join(', ')}`);
    if (structParts.length) blocks.push(structParts.join(', ') + '.');

    // Color + texture
    const colorParts: string[] = [];
    const colors = [data.mainColor, data.accentColor].filter(Boolean);
    if (colors.length) colorParts.push(`палитра: ${colors.join(' и ')}`);
    if (data.textureElement) colorParts.push(`текстура — ${data.textureElement}`);
    if (colorParts.length) blocks.push(colorParts.join(', ') + '.');

    // Style + format
    const styleParts: string[] = [];
    if (data.style) styleParts.push(`стиль — ${short(data.style)}`);
    if (data.format) styleParts.push(`формат ${data.format}`);
    if (styleParts.length) blocks.push(styleParts.join(', ') + '.');

    // Negative
    const negativeList = [
      ...data.negatives,
      ...(data.customNegative.trim() ? data.customNegative.split(',').map((s) => s.trim()).filter(Boolean) : []),
    ];
    if (negativeList.length) blocks.push(`Negative prompt: ${negativeList.join(', ')}.`);

    setGeneratedPrompt(blocks.join('\n\n'));
    setCopied(false);
  }, [data]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setData({
      role: roleOptions[0],
      object: '',
      location: '',
      environment: '',
      environmentType: '',
      background: '',
      tone: toneOptions[2],
      lighting: lightingOptions[0],
      composition: compositionOptions[0],
      lineSource: '',
      angle: angleOptions[0],
      structure: structureOptions[0],
      center: centerOptions[0],
      centerSize: centerSizeOptions[1],
      linearStructure: linearStructureOptions[0],
      mainColor: '',
      accentColor: '',
      textureElement: '',
      style: styleOptions[0],
      format: formatOptions[0],
      negatives: [
        'перегруженный кадр',
        'лишние предметы рядом с объектом',
        'хаос',
        'резкие тени',
        'низкая резкость',
        'зернистость',
        'текст',
        'логотипы',
        'блики',
      ],
      customNegative: '',
    });
    setGeneratedPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm bg-black/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              📸 Prompt Builder
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">Генератор промптов для AI-фотографии</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generatePrompt}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-sm"
            >
              ✨ Генерировать
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 border border-gray-600/30 text-gray-300 rounded-xl transition-all text-sm"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* ─── LEFT: form ─── */}
          <div className="xl:col-span-3 space-y-5">
            {/* Role */}
            <Section icon="🎭" title="Роль" color="amber">
              <Select label="Роль / ключ работы модели" value={data.role} onChange={(v) => handleChange('role', v)} options={roleOptions} />
              <p className="text-xs text-gray-500 mt-1">Роль определяет стилистику и подход AI-модели к генерации</p>
            </Section>

            {/* Scene */}
            <Section icon="🎯" title="Сцена" color="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Объект" value={data.object} onChange={(v) => handleChange('object', v)} placeholder="женское бедро в кожаных штанах для йоги" full />
                <Input label="Расположение" value={data.location} onChange={(v) => handleChange('location', v)} placeholder="асфальт" />
                <Input label="Окружение" value={data.environment} onChange={(v) => handleChange('environment', v)} placeholder="городская улица" />
                <Input label="Тип окружения" value={data.environmentType} onChange={(v) => handleChange('environmentType', v)} placeholder="интерьер кафе / лофт / арт-пространство" />
                <Input label="Фон" value={data.background} onChange={(v) => handleChange('background', v)} placeholder="закатное солнце" full />
              </div>
            </Section>

            {/* Mood & Light */}
            <Section icon="💡" title="Настроение и свет" color="yellow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select label="Тон и настроение" value={data.tone} onChange={(v) => handleChange('tone', v)} options={toneOptions} />
                <Select label="Освещение" value={data.lighting} onChange={(v) => handleChange('lighting', v)} options={lightingOptions} />
              </div>
            </Section>

            {/* Composition */}
            <Section icon="📐" title="Композиция" color="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Select label="Композиция" value={data.composition} onChange={(v) => handleChange('composition', v)} options={compositionOptions} />
                <Input label="Источник направляющих линий" value={data.lineSource} onChange={(v) => handleChange('lineSource', v)} placeholder="текстуры стола, архитектуры, теней" />
                <Select label="Ракурс" value={data.angle} onChange={(v) => handleChange('angle', v)} options={angleOptions} />
                <Select label="Линеарная структура" value={data.linearStructure} onChange={(v) => handleChange('linearStructure', v)} options={linearStructureOptions} />
                <Select label="Структура фокуса" value={data.structure} onChange={(v) => handleChange('structure', v)} options={structureOptions} />
                <Select label="Композиционный центр" value={data.center} onChange={(v) => handleChange('center', v)} options={centerOptions} />
                <Select label="Размер центра" value={data.centerSize} onChange={(v) => handleChange('centerSize', v)} options={centerSizeOptions} />
              </div>
            </Section>

            {/* Color & Style */}
            <Section icon="🎨" title="Цвет, текстура, стиль" color="pink">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="Основной цвет" value={data.mainColor} onChange={(v) => handleChange('mainColor', v)} placeholder="тёмно-синий" />
                <Input label="Акцентный цвет" value={data.accentColor} onChange={(v) => handleChange('accentColor', v)} placeholder="оранжевый" />
                <Input label="Ключевой элемент текстуры" value={data.textureElement} onChange={(v) => handleChange('textureElement', v)} placeholder="кожи, ткани, еды" full />
                <Select label="Стиль" value={data.style} onChange={(v) => handleChange('style', v)} options={styleOptions} />
                <Select label="Формат" value={data.format} onChange={(v) => handleChange('format', v)} options={formatOptions} />
              </div>
            </Section>

            {/* Negative */}
            <Section icon="🚫" title="Negative prompt — что НЕ нужно" color="red">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={selectAllNegatives} className="text-xs px-3 py-1 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 hover:bg-red-900/50 transition-all">
                  Выбрать все
                </button>
                <button onClick={clearAllNegatives} className="text-xs px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-600/30 text-gray-400 hover:bg-gray-700/50 transition-all">
                  Очистить
                </button>
                <span className="text-xs text-gray-500">Выбрано: {data.negatives.length}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {negativeItems.map((item) => {
                  const active = data.negatives.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleNegative(item)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                        active
                          ? 'bg-red-600/30 border-red-500/50 text-red-200 shadow-sm shadow-red-500/10'
                          : 'bg-gray-800/30 border-gray-700/30 text-gray-500 hover:border-gray-500/50 hover:text-gray-400'
                      }`}
                    >
                      {active ? '✕ ' : '+ '}{item}
                    </button>
                  );
                })}
              </div>
              <Input
                label="Дополнительные ограничения (через запятую)"
                value={data.customNegative}
                onChange={(v) => handleChange('customNegative', v)}
                placeholder="дым, вода, животные..."
              />
            </Section>

            {/* Mobile generate button */}
            <button
              onClick={generatePrompt}
              className="w-full xl:hidden px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
            >
              ✨ Сгенерировать промпт
            </button>
          </div>

          {/* ─── RIGHT: output ─── */}
          <div className="xl:col-span-2 space-y-5 xl:sticky xl:top-24 xl:self-start">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-300 flex items-center gap-2">
                  <span>📝</span> Готовый промпт
                </h2>
                {generatedPrompt && (
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      copied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {copied ? '✓ Скопировано!' : '📋 Копировать'}
                  </button>
                )}
              </div>

              {generatedPrompt ? (
                <pre className="whitespace-pre-wrap bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-[13px] text-gray-200 font-mono leading-relaxed max-h-[70vh] overflow-y-auto selection:bg-purple-500/30">
                  {generatedPrompt}
                </pre>
              ) : (
                <div className="bg-gray-900/40 border border-dashed border-gray-700/50 rounded-xl p-10 text-center">
                  <div className="text-5xl mb-3">🎨</div>
                  <p className="text-gray-500 text-sm">Заполните параметры и нажмите<br /><span className="text-purple-400 font-medium">«Генерировать»</span></p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/15 p-5">
              <h3 className="text-sm font-semibold text-yellow-300/80 mb-2 flex items-center gap-2">💡 Подсказки</h3>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li>• <b className="text-gray-400">Роль</b> задаёт общий стиль и подход модели</li>
                <li>• <b className="text-gray-400">Освещение + Тон</b> создают атмосферу</li>
                <li>• <b className="text-gray-400">Цвета</b> определяют палитру и контраст</li>
                <li>• <b className="text-gray-400">Negative</b> убирает нежелательные элементы</li>
                <li>• Описания в выпадающих списках — подсказки, в промпт идёт короткое название</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-purple-500/10 mt-8 py-4 text-center text-gray-600 text-xs">
        Prompt Builder • 2026
      </footer>
    </div>
  );
}

/* ───────────── helpers ───────────── */

/* ───────────── UI primitives ───────────── */
function Section({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
  const borderMap: Record<string, string> = {
    purple: 'border-purple-500/20',
    yellow: 'border-yellow-500/20',
    blue: 'border-blue-500/20',
    pink: 'border-pink-500/20',
    red: 'border-red-500/20',
    amber: 'border-amber-500/20',
    green: 'border-green-500/20',
  };
  const titleMap: Record<string, string> = {
    purple: 'text-purple-300',
    yellow: 'text-yellow-300',
    blue: 'text-blue-300',
    pink: 'text-pink-300',
    red: 'text-red-300',
    amber: 'text-amber-300',
    green: 'text-green-300',
  };
  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-2xl border ${borderMap[color] || 'border-gray-700/30'} p-5`}>
      <h2 className={`text-lg font-semibold ${titleMap[color] || 'text-gray-300'} mb-4 flex items-center gap-2`}>
        <span className="text-xl">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, full }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default App;
