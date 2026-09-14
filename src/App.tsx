import { useState, useCallback } from 'react';

interface PromptData {
  object: string;
  location: string;
  environment: string;
  background: string;
  tone: string;
  lighting: string;
  composition: string;
  angle: string;
  structure: string;
  center: string;
  centerSize: string;
  linearStructure: string;
  contrast: string;
  style: string;
  negative: string;
}

const defaultNegative = `Кадр не должен выглядеть перегруженным, важно соблюдать баланс между объектами и пустым пространством. Использование отрицательного (негативного) пространства помогает выделить предмет, делая его более заметным. Избегай захламления кадра — вокруг главного объекта не должен царить хаос. При этом отсутствие декораций и «пустой» кадр будет скучным и примитивным. Найди баланс.`;

const toneOptions = [
  'Бунтарский',
  'Романтичный',
  'Драматичный',
  'Меланхоличный',
  'Весёлый',
  'Мистический',
  'Элегантный',
  'Агрессивный',
  'Нежный',
  'Загадочный',
  'Ностальгический',
  'Энергичный',
  'Спокойный',
  'Тревожный',
  'Триумфальный',
];

const lightingOptions = [
  'High‑key',
  'Low‑key',
  'Естественный свет',
  'Золотой час',
  'Синий час',
  'Контровой свет',
  'Боковой свет',
  'Мягкий рассеянный',
  'Жёсткий направленный',
  'Неоновый',
  'Свечи',
  'Студийный',
  'Rembrandt',
  'Split lighting',
  'Butterfly lighting',
];

const compositionOptions = [
  'Крест',
  'Правило третей',
  'Диагональ',
  'Симметрия',
  'Золотое сечение',
  'Рамка в кадре',
  'Ведущие линии',
  'Паттерн',
  'Треугольник',
  'Спираль',
  'Центральная',
  'Асимметрия',
  'Минимализм',
];

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

const structureOptions = [
  'Одна точка фокуса',
  'Две точки фокуса',
  'Три точки фокуса',
  'Множественные точки',
  'Распределённый фокус',
  'Без выраженного фокуса',
];

const centerOptions = [
  'Один',
  'Два',
  'Три',
  'Группа',
  'Рассеянный',
];

const centerSizeOptions = [
  'Малый',
  'Средний',
  'Большой',
  'Доминирующий',
  'Минимальный',
];

const linearStructureOptions = [
  'Вертикальная',
  'Горизонтальная',
  'Диагональная',
  'Криволинейная',
  'Концентрическая',
  'Хаотичная',
  'Лучевая',
  'S-образная',
];

const styleOptions = [
  'Журнальный',
  'Кинематографический',
  'Документальный',
  'Портретный',
  'Fashion',
  'Street',
  'Fine Art',
  'Концептуальный',
  'Ретро',
  'Футуристический',
  'Минималистичный',
  'Барокко',
  'Поп-арт',
  'Нуар',
  'Этнографический',
];

function App() {
  const [data, setData] = useState<PromptData>({
    object: '',
    location: '',
    environment: '',
    background: '',
    tone: toneOptions[0],
    lighting: lightingOptions[0],
    composition: compositionOptions[0],
    angle: angleOptions[0],
    structure: structureOptions[0],
    center: centerOptions[0],
    centerSize: centerSizeOptions[0],
    linearStructure: linearStructureOptions[0],
    contrast: '',
    style: styleOptions[0],
    negative: defaultNegative,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof PromptData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePrompt = useCallback(() => {
    const prompt = `INPUT
Объект: ${data.object || '[укажите объект]'}
Расположение: ${data.location || '[укажите расположение]'}
Окружение: ${data.environment || '[укажите окружение]'}
Фон: ${data.background || '[укажите фон]'}
Тон и настроение: ${data.tone}
Освещение: ${data.lighting}
Композиция: ${data.composition}
Ракурс: ${data.angle}
Структура: ${data.structure}
Композиционный центр: ${data.center}
Размер композиционного центра: ${data.centerSize}
Линеарная структура: ${data.linearStructure}
Контраст и цветовые сочетания: ${data.contrast || '[укажите цвета]'}
Стиль: ${data.style}

NEGATIVE
${data.negative}`;

    setGeneratedPrompt(prompt);
    setCopied(false);
  }, [data]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = generatedPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setData({
      object: '',
      location: '',
      environment: '',
      background: '',
      tone: toneOptions[0],
      lighting: lightingOptions[0],
      composition: compositionOptions[0],
      angle: angleOptions[0],
      structure: structureOptions[0],
      center: centerOptions[0],
      centerSize: centerSizeOptions[0],
      linearStructure: linearStructureOptions[0],
      contrast: '',
      style: styleOptions[0],
      negative: defaultNegative,
    });
    setGeneratedPrompt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            📸 Генератор промптов для фото
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Создавайте детальные промпты для генерации фотографий
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
              <h2 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> INPUT — Параметры кадра
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Text Fields */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Объект
                  </label>
                  <input
                    type="text"
                    value={data.object}
                    onChange={(e) => handleChange('object', e.target.value)}
                    placeholder="Например: женское бедро в кожаных штанах для йоги"
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Расположение
                  </label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Например: асфальт"
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Окружение
                  </label>
                  <input
                    type="text"
                    value={data.environment}
                    onChange={(e) => handleChange('environment', e.target.value)}
                    placeholder="Например: городская улица"
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Фон
                  </label>
                  <input
                    type="text"
                    value={data.background}
                    onChange={(e) => handleChange('background', e.target.value)}
                    placeholder="Например: закатное солнце"
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>

                {/* Select Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Тон и настроение
                  </label>
                  <select
                    value={data.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {toneOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Освещение
                  </label>
                  <select
                    value={data.lighting}
                    onChange={(e) => handleChange('lighting', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {lightingOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Композиция
                  </label>
                  <select
                    value={data.composition}
                    onChange={(e) => handleChange('composition', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {compositionOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ракурс
                  </label>
                  <select
                    value={data.angle}
                    onChange={(e) => handleChange('angle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {angleOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Структура
                  </label>
                  <select
                    value={data.structure}
                    onChange={(e) => handleChange('structure', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {structureOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Композиционный центр
                  </label>
                  <select
                    value={data.center}
                    onChange={(e) => handleChange('center', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {centerOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Размер композиционного центра
                  </label>
                  <select
                    value={data.centerSize}
                    onChange={(e) => handleChange('centerSize', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {centerSizeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Линеарная структура
                  </label>
                  <select
                    value={data.linearStructure}
                    onChange={(e) => handleChange('linearStructure', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {linearStructureOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Контраст и цветовые сочетания
                  </label>
                  <input
                    type="text"
                    value={data.contrast}
                    onChange={(e) => handleChange('contrast', e.target.value)}
                    placeholder="Например: тёмно-синий, оранжевый"
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Стиль
                  </label>
                  <select
                    value={data.style}
                    onChange={(e) => handleChange('style', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {styleOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-gray-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Negative Section */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6">
              <h2 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚫</span> NEGATIVE — Ограничения
              </h2>
              <textarea
                value={data.negative}
                onChange={(e) => handleChange('negative', e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 bg-gray-800/50 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-y"
                placeholder="Опишите что НЕ должно быть в кадре..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={generatePrompt}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                ✨ Сгенерировать промпт
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-500/30 text-gray-300 font-semibold rounded-xl transition-all duration-300"
              >
                🔄 Сбросить
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-green-500/20 p-6">
              <h2 className="text-xl font-semibold text-green-300 mb-4 flex items-center gap-2">
                <span className="text-2xl">📝</span> Сгенерированный промпт
              </h2>

              {generatedPrompt ? (
                <div className="relative">
                  <pre className="whitespace-pre-wrap bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-200 font-mono leading-relaxed max-h-[600px] overflow-y-auto">
                    {generatedPrompt}
                  </pre>
                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {copied ? '✓ Скопировано!' : '📋 Копировать'}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900/50 border border-dashed border-gray-600/50 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">🎨</div>
                  <p className="text-gray-400 text-sm">
                    Заполните параметры и нажмите «Сгенерировать промпт»
                  </p>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <span>💡</span> Советы
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Будьте конкретны в описании объекта — это ключевой элемент</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Комбинация освещения и тона создаёт атмосферу кадра</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Цветовые сочетания влияют на эмоциональное восприятие</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Negative промпт помогает избежать нежелательных элементов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>Генератор промптов для AI-фотографии • 2026</p>
      </footer>
    </div>
  );
}

export default App;
