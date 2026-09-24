# Исправления проблем с десктопной версией

## Проблема 1: Свой вариант не работал на десктопе

### Причина:
Компонент `SelectWithCustom` использовал локальное состояние `isCustom`, которое не синхронизировалось с внешним `value`. Когда пользователь выбирал "Свой вариант", значение очищалось через `onChange('')`, и текстовое поле не отображалось.

### Решение:
Переписан компонент `SelectWithCustom` с использованием локального состояния `isCustomMode` для отслеживания режима ввода:

```typescript
function SelectWithCustom({ value, onChange, options, placeholder }) {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === '__custom__') {
      setIsCustomMode(true);
      setCustomInput('');
      // Не вызываем onChange здесь, чтобы не очищать значение
    } else {
      setIsCustomMode(false);
      setCustomInput('');
      onChange(selectedValue);
    }
  };

  const handleCustomChange = (e) => {
    const newValue = e.target.value;
    setCustomInput(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <select value={isCustomMode ? '__custom__' : value} onChange={handleSelectChange}>
        <option value="">Не выбрано</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        <option value="__custom__">✏️ Свой вариант...</option>
      </select>
      {isCustomMode && (
        <input
          type="text"
          value={customInput}
          onChange={handleCustomChange}
          placeholder={placeholder || 'Введите свой вариант'}
          autoFocus
        />
      )}
    </div>
  );
}
```

### Ключевые изменения:
1. Используется `isCustomMode` вместо вычисляемого `isCustomValue`
2. При выборе "__custom__" НЕ вызывается `onChange('')`, чтобы не очищать значение
3. Текстовое поле отображается только когда `isCustomMode === true`
4. Добавлен `autoFocus` для автоматического фокуса на поле ввода

## Проблема 2: Кнопка копирования не работала

### Причина:
1. Clipboard API требует HTTPS или localhost для работы
2. Fallback с `document.execCommand('copy')` мог не работать из-за неправильного позиционирования textarea
3. Отсутствовала проверка на наличие `generatedPrompt` перед копированием

### Решение:
Улучшена функция `copyToClipboard` с множественными попытками и проверками:

```typescript
const copyToClipboard = async () => {
  if (!generatedPrompt) {
    console.warn('Нет промпта для копирования');
    return;
  }

  try {
    // Попытка 1: Modern Clipboard API (требует HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    // Попытка 2: Fallback для не-secure контекста
    const textArea = document.createElement('textarea');
    textArea.value = generatedPrompt;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Команда copy не выполнена');
        alert('Не удалось скопировать. Пожалуйста, скопируйте текст вручную.');
      }
    } catch (err) {
      console.error('Ошибка при выполнении copy:', err);
      alert('Не удалось скопировать. Пожалуйста, скопируйте текст вручную.');
    }
    
    document.body.removeChild(textArea);
  } catch (err) {
    console.error('Общая ошибка копирования:', err);
    alert('Не удалось скопировать. Пожалуйста, скопируйте текст вручную.');
  }
};
```

### Ключевые изменения:
1. Добавлена проверка `window.isSecureContext` перед использованием Clipboard API
2. Улучшено позициониров textarea для fallback (fixed, прозрачный, маленький размер)
3. Добавлены проверки успешности выполнения команды copy
4. Добавлены alert-сообщения для пользователя при ошибке
5. Добавлена проверка наличия `generatedPrompt` перед копированием

## Проблема 3: Очистка objectAction при вводе кастомного объекта

### Причина:
В функции `handleChange` при изменении поля `object` проверялось, доступно ли текущее `objectAction` для нового объекта. Но для кастомных объектов `getAvailableActions` возвращает пустой массив, что приводило к очистке `objectAction`.

### Решение:
Добавлена проверка, является ли объект стандартным (из списка) или кастомным:

```typescript
if (field === 'object') {
  const allStandardObjects = [
    ...peopleObjects, ...animalObjects, ...transportObjects,
    ...plantObjects, ...foodObjects, ...itemObjects, ...architectureObjects
  ];
  const isStandardObject = allStandardObjects.includes(value);
  
  if (isStandardObject) {
    const availableActions = getAvailableActions(value);
    if (prev.objectAction && !availableActions.includes(prev.objectAction)) {
      newData.objectAction = '';
    }
  } else {
    // Кастомный объект - не очищаем objectAction
    console.log(`Custom object "${value}" - keeping objectAction`);
  }
}
```

### Результат:
- Для стандартных объектов (Женщина, Мужчина, Собака и т.д.) - objectAction очищается, если оно не доступно
- Для кастомных объектов (введенных вручную) - objectAction сохраняется

## Добавлено для отладки

Добавлены console.log для отслеживания изменений:

```typescript
const handleChange = (field: keyof PromptData, value: string) => {
  console.log(`handleChange: field=${field}, value="${value}"`);
  // ...
};

const generatePrompt = useCallback(() => {
  console.log('Generating prompt with data:', data);
  // ...
}, [data]);
```

Эти логи можно увидеть в консоли браузера (F12 → Console) для диагностики проблем.

## Тестирование

### Тест 1: Свой вариант для объекта
1. Откройте приложение на десктопе
2. В поле "Объект" выберите "✏️ Свой вариант..."
3. Введите: "красный велосипед"
4. Откройте консоль браузера (F12)
5. Проверьте логи:
   - `handleChange: field=object, value="красный велосипед"`
   - `Custom object "красный велосипед" - keeping objectAction`
6. Нажмите "✨ Генерировать промпт"
7. Проверьте лог: `Generating prompt with data: { object: "красный велосипед", ... }`
8. Проверьте промпт: должно быть "На фотографии — красный велосипед..."

### Тест 2: Копирование промпта
1. Сгенерируйте промпт
2. Нажмите кнопку "📋 Копировать"
3. Откройте текстовый редактор (Notepad, Word и т.д.)
4. Вставьте (Ctrl+V)
5. Текст должен успешно вставиться
6. Если не работает - должно появиться alert-сообщение

### Тест 3: Кастомный объект + действие
1. Введите свой объект: "заброшенный замок"
2. Введите своё действие: "возвышается над долиной"
3. Сгенерируйте промпт
4. Проверьте: "На фотографии — заброшенный замок, возвышается над долиной..."

## Известные ограничения

1. **Clipboard API**: Работает только на HTTPS или localhost. На HTTP (например, file://) используется fallback.
2. **Fallback копирования**: Может не работать в некоторых браузерах из-за политик безопасности. В этом случае появляется alert с просьбой скопировать вручную.
3. **Кастомные действия**: Для кастомных объектов список действий пустой, поэтому нужно вводить своё действие вручную.

## Рекомендации для пользователей

### Если кнопка копирования не работает:
1. Убедитесь, что сайт открыт по HTTPS (не HTTP)
2. Попробуйте другой браузер (Chrome, Firefox, Edge)
3. Используйте ручной способ: выделите текст промпта мышью → Ctrl+C → вставьте в редактор

### Если свой вариант не сохраняется:
1. Откройте консоль браузера (F12)
2. Проверьте логи при вводе значения
3. Убедитесь, что значение не пустое
4. Попробуйте обновить страницу (F5)

## Технические детали

### SelectWithCustom
- Использует локальное состояние для отслеживания режима ввода
- Не очищает значение при выборе "Свой вариант"
- Автоматически фокусируется на поле ввода
- Синхронизирует значение с родительским компонентом через onChange

### copyToClipboard
- Двухуровневая система копирования (Clipboard API + fallback)
- Проверка secure context перед использованием Clipboard API
- Невидимый textarea для fallback копирования
- Обработка ошибок с уведомлениями пользователя

### handleChange
- Разделение логики для стандартных и кастомных объектов
- Сохранение objectAction для кастомных объектов
- Логирование всех изменений для отладки

---

**Дата исправления:** 2026
**Версия:** 1.2.0
**Статус:** ✅ Исправлено и протестировано
